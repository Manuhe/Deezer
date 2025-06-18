import { query } from "../../../../config/database.js";

export default {
  async findAll() {
    const result = await query("SELECT * FROM tracks ORDER BY id DESC");
    return result.rows || [];
  },

  async findById(id) {
    const result = await query("SELECT * FROM tracks WHERE id = :id", { id });
    return result.rows?.[0] || null;
  },

  async create({ title, duration, audio_url }) {
    const sql = `INSERT INTO tracks (title, duration, audio_url)
                 VALUES (:title, :duration, :audio_url)
                 RETURNING *`;
    const result = await query(
      sql,
      { title, duration, audio_url },
      { autoCommit: true }
    );
    return result.rows?.[0];
  },

  async update(id, { title, duration, audio_url }) {
    const sql = `UPDATE tracks
                 SET title = :title, duration = :duration, audio_url = :audio_url
                 WHERE id = :id RETURNING *`;
    const result = await query(
      sql,
      { id, title, duration, audio_url },
      { autoCommit: true }
    );
    return result.rows?.[0];
  },

  async delete(id) {
    await query(
      "DELETE FROM tracks WHERE id = :id",
      { id },
      { autoCommit: true }
    );
    return true;
  },
};
