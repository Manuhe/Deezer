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

        const pagination = req.parsedQuery?.pagination || {};

        // Convertir bio (CLOB) a string si existe
        const plainRows = Array.isArray(result.rows)
          ? result.rows.map((row) => {
              const obj = JSON.parse(JSON.stringify(row));
              if (obj.bio && typeof obj.bio !== "string") {
                obj.bio = String(obj.bio);
              }
              return obj;
            })
          : [];

        res.json({
          data: plainRows,
          meta: {
            pagination: {
              count: plainRows.length,
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
        let plainRow = result.rows[0]
          ? JSON.parse(JSON.stringify(result.rows[0]))
          : {};
        if (plainRow.bio && typeof plainRow.bio !== "string") {
          plainRow.bio = String(plainRow.bio);
        }
        res.json(plainRow);
      } catch (err) {
        console.error(`Error in findOne - SQL: ${sql}`, err);
        res.status(500).json({ error: err.message });
      }
    },

    async create(req, res) {
      // Separar datos relacionales tipo { artist: { connect: [1,2] } }
      const data = { ...req.body };
      const relations = {};
      Object.keys(data).forEach((key) => {
        if (
          data[key] &&
          typeof data[key] === "object" &&
          Array.isArray(data[key].connect)
        ) {
          relations[key] = data[key].connect;
          delete data[key];
        }
      });
      // Obtener columnas válidas de la tabla
      let validColumns = [];
      try {
        const colsResult = await query(
          `SELECT COLUMN_NAME FROM ALL_TAB_COLUMNS WHERE TABLE_NAME = '${tableName.toUpperCase()}'`
        );
        validColumns = colsResult.rows.map((r) => r.COLUMN_NAME.toLowerCase());
      } catch (metaErr) {
        // Si falla, continuar sin filtrar (mejor que fallar el insert)
        validColumns = Object.keys(data);
      }
      // Filtrar solo los campos válidos
      Object.keys(data).forEach((k) => {
        if (!validColumns.includes(k.toLowerCase())) {
          delete data[k];
        }
      });
      const keys = Object.keys(data);
      if (keys.length === 0) {
        return res.status(400).json({
          error: "No se enviaron atributos válidos para crear el registro.",
        });
      }
      const sql = `INSERT INTO ${tableName} (${keys.join(",")}) VALUES (${keys
        .map((k) => ":" + k)
        .join(",")})`;
      try {
        console.log(`Executing SQL (create): ${sql}`, data);
        await query(sql, data);
        // Obtener el último id insertado (Oracle)
        const idResult = await query(`SELECT MAX(id) as id FROM ${tableName}`);
        const newId = idResult.rows[0]?.id;
        // Procesar relaciones si existen
        for (const rel in relations) {
          const targetIds = relations[rel];
          if (targetIds.length > 0) {
            const relatedTable = `${tableName.slice(0, -1)}_${rel}`;
            const connectBody = {
              relatedTable,
              sourceId: newId,
              targetIds,
              sourceKey: "id",
              targetKey: "id",
            };
            await this.connect(
              { body: connectBody },
              { json: () => {}, status: () => ({ json: () => {} }) }
            );
          }
        }
        // Obtener el objeto creado
        const createdResult = await query(
          `SELECT * FROM ${tableName} WHERE id = :id`,
          { id: newId }
        );
        const createdObject = createdResult.rows[0] || {};
        res
          .status(201)
          .json({ message: "Created", id: newId, object: createdObject });
      } catch (err) {
        // Analizar errores comunes y dar mensajes claros
        let userMessage = err.message;
        if (err.message.includes("ORA-00925")) {
          userMessage =
            "Error de sintaxis SQL: falta la palabra clave INTO. Revisa la consulta y los atributos enviados.";
        } else if (err.message.includes("ORA-00936")) {
          userMessage =
            "Faltan valores requeridos en la consulta. Verifica que todos los campos obligatorios estén presentes.";
        } else if (err.message.includes("ORA-01400")) {
          userMessage =
            "No se puede insertar NULL en un campo obligatorio. Verifica los campos requeridos.";
        } else if (err.message.includes("ORA-00947")) {
          userMessage =
            "El número de columnas no coincide con el número de valores. Revisa los datos enviados.";
        }
        res.status(500).json({ error: userMessage, sql, binds: data });
      }
    },

    async update(req, res) {
      // Separar datos relacionales tipo { artist: { connect: [1,2] } }
      const data = { ...req.body };
      const relations = {};
      Object.keys(data).forEach((key) => {
        if (
          data[key] &&
          typeof data[key] === "object" &&
          Array.isArray(data[key].connect)
        ) {
          relations[key] = data[key].connect;
          delete data[key];
        }
      });
      const keys = Object.keys(data);
      const sets = keys.map((k) => `${k} = :${k}`).join(", ");
      const sql = `UPDATE ${tableName} SET ${sets} WHERE id = :id`;
      try {
        console.log(`Executing SQL (update): ${sql}`, {
          ...data,
          id: req.params.id,
        });
        await query(sql, { ...data, id: req.params.id });
        // Procesar relaciones si existen
        for (const rel in relations) {
          const targetIds = relations[rel];
          if (targetIds.length > 0) {
            const relatedTable = `${tableName.slice(0, -1)}_${rel}`;
            const connectBody = {
              relatedTable,
              sourceId: req.params.id,
              targetIds,
              sourceKey: "id",
              targetKey: "id",
            };
            await this.connect(
              { body: connectBody },
              { json: () => {}, status: () => ({ json: () => {} }) }
            );
          }
        }
        // Obtener el objeto actualizado
        const updatedResult = await query(
          `SELECT * FROM ${tableName} WHERE id = :id`,
          { id: req.params.id }
        );
        const updatedObject = updatedResult.rows[0] || {};
        res.json({ message: "Updated", object: updatedObject });
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

    async connect(req, res) {
      // Permite conectar uno o varios registros en una tabla pivote (relación N:M)
      // Body esperado: { relatedTable, sourceId, targetIds: [], sourceKey, targetKey }
      const {
        relatedTable,
        sourceId,
        targetIds,
        sourceKey = "id",
        targetKey = "id",
      } = req.body;
      if (
        !relatedTable ||
        !sourceId ||
        !Array.isArray(targetIds) ||
        targetIds.length === 0
      ) {
        return res.status(400).json({
          error: "relatedTable, sourceId y targetIds[] son requeridos",
        });
      }
      // Ejemplo: INSERT INTO playlist_tracks (playlist_id, track_id) VALUES (:sourceId, :targetId)
      const sourceCol = `${tableName.slice(0, -1)}_${sourceKey}`;
      const targetCol = `${relatedTable.slice(0, -1)}_${targetKey}`;
      const sql = `INSERT INTO ${relatedTable} (${sourceCol}, ${targetCol}) VALUES ${targetIds
        .map((_, i) => `(:sourceId${i}, :targetId${i})`)
        .join(", ")}`;
      const binds = {};
      targetIds.forEach((tid, i) => {
        binds[`sourceId${i}`] = sourceId;
        binds[`targetId${i}`] = tid;
      });
      try {
        console.log(`Executing SQL (connect): ${sql}`, binds);
        await query(sql, binds);
        res.json({ message: "Connected", count: targetIds.length });
      } catch (err) {
        console.error(`Error in connect - SQL: ${sql}`, err);
        res.status(500).json({ error: err.message });
      }
    },

    async disconnect(req, res) {
      // Permite desconectar uno o varios registros en una tabla pivote (relación N:M)
      // Body esperado: { relatedTable, sourceId, targetIds: [], sourceKey, targetKey }
      const {
        relatedTable,
        sourceId,
        targetIds,
        sourceKey = "id",
        targetKey = "id",
      } = req.body;
      if (
        !relatedTable ||
        !sourceId ||
        !Array.isArray(targetIds) ||
        targetIds.length === 0
      ) {
        return res.status(400).json({
          error: "relatedTable, sourceId y targetIds[] son requeridos",
        });
      }
      const sourceCol = `${tableName.slice(0, -1)}_${sourceKey}`;
      const targetCol = `${relatedTable.slice(0, -1)}_${targetKey}`;
      const sql = `DELETE FROM ${relatedTable} WHERE ${sourceCol} = :sourceId AND ${targetCol} IN (${targetIds
        .map((_, i) => `:targetId${i}`)
        .join(", ")})`;
      const binds = { sourceId };
      targetIds.forEach((tid, i) => {
        binds[`targetId${i}`] = tid;
      });
      try {
        console.log(`Executing SQL (disconnect): ${sql}`, binds);
        await query(sql, binds);
        res.json({ message: "Disconnected", count: targetIds.length });
      } catch (err) {
        console.error(`Error in disconnect - SQL: ${sql}`, err);
        res.status(500).json({ error: err.message });
      }
    },
  };
}
