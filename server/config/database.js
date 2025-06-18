import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let connection = null;

export async function initOracleConnection() {
  if (connection) return;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      connectString: process.env.DB_HOST,
    });
    console.log("✅ Oracle DB connection established");
  } catch (err) {
    console.error("❌ Failed to establish Oracle DB connection:", err.message);
    throw new Error("Database initialization failed");
  }
}

export async function query(sql, binds = {}, options = {}) {
  try {
    if (!connection) {
      throw new Error("Oracle connection not initialized");
    }

    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error("❌ Query execution error:", {
      sql,
      binds,
      message: err.message,
    });
    throw err; // Re-lanza el error para que pueda ser manejado en capas superiores
  }
}

export async function closeConnection() {
  if (!connection) return;

  try {
    await connection.close();
    console.log("🔒 Oracle connection closed");
    connection = null;
  } catch (err) {
    console.error("❌ Error closing Oracle connection:", err.message);
  }
}

export async function getOracleTables() {
  try {
    const sql = `
      SELECT table_name
      FROM user_tables
      ORDER BY table_name
    `;
    const result = await query(sql);
    return result.rows.map((row) => row.TABLE_NAME.toLowerCase());
  } catch (err) {
    console.error("❌ Error fetching table names:", err.message);
    throw err;
  }
}
