import qs from "qs";

export function parseQuery(req, res, next) {
  const parsed = qs.parse(req._parsedUrl.query, {
    allowDots: true,
    depth: 10,
  });

  req.parsedQuery = {
    filters: parsed.filters || {},
    sort: parsed.sort || [],
    fields: parsed.fields || ["*"],
    populate: parsed.populate || {},
    pagination: {
      page: parseInt(parsed.pagination?.page || 1),
      pageSize: parseInt(parsed.pagination?.pageSize || 10),
    },
    raw: parsed, // en caso lo necesites todo
  };

  next();
}
