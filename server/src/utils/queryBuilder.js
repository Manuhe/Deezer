export function buildSQL({
  table,
  filters = {},
  fields = ["*"],
  sort = [],
  pagination = {},
  populate = {}, // ← nuevo parámetro
}) {
  let bindIndex = 0;
  const binds = {};
  const joins = [];
  const selectedFields = [];

  function nextBindKey(base) {
    bindIndex++;
    return `${base}_${bindIndex}`;
  }

  function parseFilter(filter) {
    if (typeof filter !== "object" || filter === null) return "";
    const parts = [];

    for (const [fieldOrOp, condition] of Object.entries(filter)) {
      if (fieldOrOp === "$or" && Array.isArray(condition)) {
        const orParts = condition
          .map((f) => `(${parseFilter(f)})`)
          .filter(Boolean);
        if (orParts.length) parts.push(`(${orParts.join(" OR ")})`);
      } else if (fieldOrOp === "$and" && Array.isArray(condition)) {
        const andParts = condition
          .map((f) => `(${parseFilter(f)})`)
          .filter(Boolean);
        if (andParts.length) parts.push(`(${andParts.join(" AND ")})`);
      } else if (fieldOrOp === "$not" && typeof condition === "object") {
        const notPart = parseFilter(condition);
        if (notPart) parts.push(`NOT (${notPart})`);
      } else if (typeof condition === "object" && condition !== null) {
        for (const [op, val] of Object.entries(condition)) {
          const key = nextBindKey(fieldOrOp.replace(/\W/g, "_"));
          switch (op) {
            case "$eq":
              parts.push(`${fieldOrOp} = :${key}`);
              binds[key] = val;
              break;
            case "$eqi":
              parts.push(`LOWER(${fieldOrOp}) = LOWER(:${key})`);
              binds[key] = val;
              break;
            case "$ne":
              parts.push(`${fieldOrOp} != :${key}`);
              binds[key] = val;
              break;
            case "$nei":
              parts.push(`LOWER(${fieldOrOp}) != LOWER(:${key})`);
              binds[key] = val;
              break;
            case "$lt":
              parts.push(`${fieldOrOp} < :${key}`);
              binds[key] = val;
              break;
            case "$lte":
              parts.push(`${fieldOrOp} <= :${key}`);
              binds[key] = val;
              break;
            case "$gt":
              parts.push(`${fieldOrOp} > :${key}`);
              binds[key] = val;
              break;
            case "$gte":
              parts.push(`${fieldOrOp} >= :${key}`);
              binds[key] = val;
              break;
            case "$in":
              if (Array.isArray(val) && val.length > 0) {
                const inKeys = val.map((v, i) => {
                  const k = `${key}_${i}`;
                  binds[k] = v;
                  return `:${k}`;
                });
                parts.push(`${fieldOrOp} IN (${inKeys.join(", ")})`);
              } else {
                parts.push("1=0");
              }
              break;
            case "$notIn":
              if (Array.isArray(val) && val.length > 0) {
                const notInKeys = val.map((v, i) => {
                  const k = `${key}_${i}`;
                  binds[k] = v;
                  return `:${k}`;
                });
                parts.push(`${fieldOrOp} NOT IN (${notInKeys.join(", ")})`);
              } else {
                parts.push("1=1");
              }
              break;
            case "$contains":
              parts.push(`${fieldOrOp} LIKE :${key}`);
              binds[key] = `%${val}%`;
              break;
            case "$notContains":
              parts.push(`${fieldOrOp} NOT LIKE :${key}`);
              binds[key] = `%${val}%`;
              break;
            case "$containsi":
              parts.push(`LOWER(${fieldOrOp}) LIKE LOWER(:${key})`);
              binds[key] = `%${val}%`;
              break;
            case "$notContainsi":
              parts.push(`LOWER(${fieldOrOp}) NOT LIKE LOWER(:${key})`);
              binds[key] = `%${val}%`;
              break;
            case "$null":
              parts.push(`${fieldOrOp} IS NULL`);
              break;
            case "$notNull":
              parts.push(`${fieldOrOp} IS NOT NULL`);
              break;
            case "$between":
              if (Array.isArray(val) && val.length === 2) {
                const key1 = `${key}_start`,
                  key2 = `${key}_end`;
                binds[key1] = val[0];
                binds[key2] = val[1];
                parts.push(`${fieldOrOp} BETWEEN :${key1} AND :${key2}`);
              }
              break;
            case "$startsWith":
              parts.push(`${fieldOrOp} LIKE :${key}`);
              binds[key] = `${val}%`;
              break;
            case "$startsWithi":
              parts.push(`LOWER(${fieldOrOp}) LIKE LOWER(:${key})`);
              binds[key] = `${val}%`;
              break;
            case "$endsWith":
              parts.push(`${fieldOrOp} LIKE :${key}`);
              binds[key] = `%${val}`;
              break;
            case "$endsWithi":
              parts.push(`LOWER(${fieldOrOp}) LIKE LOWER(:${key})`);
              binds[key] = `%${val}`;
              break;
            default:
              break;
          }
        }
      } else {
        const key = nextBindKey(fieldOrOp.replace(/\W/g, "_"));
        parts.push(`${fieldOrOp} = :${key}`);
        binds[key] = condition;
      }
    }

    return parts.join(" AND ");
  }

  // Manejo de populate
  for (const [relation, value] of Object.entries(populate)) {
    const alias = relation;
    joins.push(
      `LEFT JOIN ${relation} ${alias} ON ${alias}.id = ${table}.${relation}_id`
    );
    if (value === true) {
      selectedFields.push(`${alias}.*`);
    } else if (Array.isArray(value)) {
      selectedFields.push(
        ...value.map((f) => `${alias}.${f} AS ${alias}_${f}`)
      );
    }
  }

  const whereClause = parseFilter(filters);
  const where = whereClause ? `WHERE ${whereClause}` : "";

  const orderBy =
    sort.length > 0
      ? sort
          .map((s) => {
            const [field, dir = "ASC"] = s.split(":");
            return `${field} ${dir.toUpperCase()}`;
          })
          .join(", ")
      : `${table}.id DESC`;

  const finalFields = [
    ...fields.map((f) => `${table}.${f}`),
    ...selectedFields,
  ].join(", ");
  const pageSize = pagination.pageSize || 10;
  const offset = ((pagination.page || 1) - 1) * pageSize;

  const sql = `
    SELECT ${finalFields} FROM ${table}
    ${joins.join("\n")}
    ${where}
    ORDER BY ${orderBy}
    OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY
  `;

  binds.offset = offset;
  binds.limit = pageSize;

  console.log(`Generated SQL: ${sql}`);
  console.log(`With binds:`, binds);
  return { sql, binds };
}
