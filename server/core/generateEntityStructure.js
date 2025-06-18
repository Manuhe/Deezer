import fs from "fs";
import path from "path";
import { getOracleTables } from "../config/database.js";

const baseDir = path.resolve("./src/api");

function pascalToKebab(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function ensureDir(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
    console.log(`📁 Created: ${filePath}`);
  }
}

function ensureFile(filePath, content = "") {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`📄 Created: ${filePath}`);
  }
}

export async function generateEntityStructure() {
  const tables = await getOracleTables();

  for (const table of tables) {
    const entityName = table.toLowerCase(); // e.g. "tracks"
    const kebab = pascalToKebab(entityName);

    const entityDir = path.join(baseDir, kebab);
    const controllersDir = path.join(entityDir, "controllers");
    const routesDir = path.join(entityDir, "routes");
    const servicesDir = path.join(entityDir, "services");

    // Crear carpetas
    ensureDir(controllersDir);
    ensureDir(routesDir);
    ensureDir(servicesDir);

    // Archivos con contenido array por defecto
    // Rutas: array vacío
    ensureFile(
      path.join(routesDir, `${kebab}-routes-01.js`),
      `export default [\n\n];\n`
    );

    // Controladores: objeto con funciones vacías
    ensureFile(
      path.join(controllersDir, `${kebab}-controller.js`),
      `export default {\n  };\n`
    );

    // Servicios: objeto con funciones vacías
    ensureFile(
      path.join(servicesDir, `${kebab}-service.js`),
      `export default {\n  \n};\n`
    );
  }

  console.log("✅ Estructura generada correctamente.");
}
