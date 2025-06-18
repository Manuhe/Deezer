import { query } from "../../config/database.js";
import { buildSQL } from "../utils/queryBuilder.js";

export function generateCrudController(tableName) {
  return {
    async find(req, res) {
      try {
        const { sql, binds } = buildSQL({
          table: tableName,
          ...req.parsedQuery,
        });

        console.log(`Executing SQL (find): ${sql}`, binds);
        const result = await query(sql, binds);

        // Corrección: evitar error si parsedQuery o pagination no existen
        const pagination = req.parsedQuery?.pagination || {};

        res.json({
          data: result.rows,
          meta: {
            pagination: {
              count: result.rows.length,
              ...pagination,
            },
          },
        });
      } catch (err) {
        console.error(`Error in find - SQL: ${err.sql || "no SQL info"}`, err);
        res.status(500).json({ error: err.message });
      }
    },

    async findOne(req, res) {
      const sql = `SELECT * FROM ${tableName} WHERE id = :id`;
      try {
        console.log(`Executing SQL (findOne): ${sql}`, { id: req.params.id });
        const result = await query(sql, { id: req.params.id });
        res.json(result.rows[0] || {});
      } catch (err) {
        console.error(`Error in findOne - SQL: ${sql}`, err);
        res.status(500).json({ error: err.message });
      }
    },

    async create(req, res) {
      const keys = Object.keys(req.body);
      const sql = `INSERT INTO ${tableName} (${keys.join(",")}) VALUES (${keys
        .map((k) => ":" + k)
        .join(",")})`;

      try {
        console.log(`Executing SQL (create): ${sql}`, req.body);
        await query(sql, req.body);
        res.status(201).json({ message: "Created" });
      } catch (err) {
        console.error(`Error in create - SQL: ${sql}`, err);
        res.status(500).json({ error: err.message });
      }
    },

    async update(req, res) {
      const keys = Object.keys(req.body);
      const sets = keys.map((k) => `${k} = :${k}`).join(", ");
      const sql = `UPDATE ${tableName} SET ${sets} WHERE id = :id`;

      try {
        console.log(`Executing SQL (update): ${sql}`, {
          ...req.body,
          id: req.params.id,
        });
        await query(sql, { ...req.body, id: req.params.id });
        res.json({ message: "Updated" });
      } catch (err) {
        console.error(`Error in update - SQL: ${sql}`, err);
        res.status(500).json({ error: err.message });
      }
    },

    async deleteOne(req, res) {
      const sql = `DELETE FROM ${tableName} WHERE id = :id`;
      try {
        console.log(`Executing SQL (deleteOne): ${sql}`, { id: req.params.id });
        await query(sql, { id: req.params.id });
        res.json({ message: "Deleted" });
      } catch (err) {
        console.error(`Error in deleteOne - SQL: ${sql}`, err);
        res.status(500).json({ error: err.message });
      }
    },
  };
}
