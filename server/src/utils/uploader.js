import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

// Asegura que el directorio exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Función para verificar si es archivo de audio
function isAudio(file) {
  const audioMimeTypes = [
    "audio/mpeg", // .mp3
    "audio/wav",
    "audio/x-wav",
    "audio/x-m4a",
    "audio/mp4",
    "audio/ogg",
  ];
  return audioMimeTypes.includes(file.mimetype);
}

// Middleware personalizado para validar tipo de archivo
function fileFilter(req, file, cb) {
  if (isAudio(file)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos de audio."), false);
  }
}

// Multer básico, single o multiple
function uploader({
  maxCount = 1,
  fieldName = "file",
  allowMultiple = false,
} = {}) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      const uniqueName = `${name}-${Date.now()}${ext}`;
      cb(null, uniqueName);
    },
  });

  const instance = multer({ storage, fileFilter });

  if (allowMultiple) {
    return instance.array(fieldName, maxCount);
  } else {
    return instance.single(fieldName);
  }
}

export { uploader, isAudio };
