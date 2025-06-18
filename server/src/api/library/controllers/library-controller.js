import path from "path";
import { fileURLToPath } from "url";
import { Registry } from "../../../../config/registry.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  find(req, res) {
    Registry.services.library.findAll().then((data) => res.json(data));
  },

  findOne(req, res) {
    const id = req.params.id;
    Registry.services.library.findById(id).then((data) => {
      if (!data) return res.status(404).json({ error: "Not found" });
      res.json(data);
    });
  },

  create(req, res) {
    Registry.services.library
      .create(req.body)
      .then((data) => res.status(201).json(data));
  },

  update(req, res) {
    const id = req.params.id;
    Registry.services.library
      .update(id, req.body)
      .then((data) => res.json(data));
  },

  deleteOne(req, res) {
    const id = req.params.id;
    Registry.services.library
      .delete(id)
      .then(() => res.json({ success: true }));
  },

  upload(req, res) {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filename = req.file.filename;
    const url = `/uploads/${filename}`;

    Registry.services.library
      .create({
        title: req.body.title || filename,
        duration: req.body.duration || 0,
        audio_url: url,
      })
      .then((data) => {
        res.status(201).json({
          message: "File uploaded successfully",
          file: url,
          track: data,
        });
      });
  },
};
