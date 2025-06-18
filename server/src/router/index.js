import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath, pathToFileURL } from "url";
import { Registry } from "../../config/registry.js";

import { generateCrudController } from "../controllers/crudController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiPath = path.join(__dirname, "../api");

function pluralize(word) {
  if (word.endsWith("y")) {
    return word.slice(0, -1) + "ies";
  }
  if (word.endsWith("s")) {
    return word;
  }
  return word + "s";
}

const loadRoutes = async () => {
  let controller = {};
  const entities = await fs.readdir(apiPath);

  for (const entity of entities) {
    const entityPath = path.join(apiPath, entity);
    const routesPath = path.join(entityPath, "routes");
    const controllersPath = path.join(entityPath, "controllers");

    const pluralEntity = pluralize(entity);
    const basePath = `/${pluralEntity}`;

    /** =====================
     * LOAD CONTROLLER
     =======================*/

    try {
      const controllerFiles = await fs.readdir(controllersPath);
      for (const file of controllerFiles) {
        if (file.endsWith(".js")) {
          const controllerFileURL = pathToFileURL(
            path.join(controllersPath, file)
          ).href;
          const ctrlModule = await import(controllerFileURL);
          Object.assign(controller, ctrlModule.default || {});
        }
      }
    } catch (error) {
      console.warn(`⚠️  No controller folder for: ${entity}`);
    }

    // Si no tiene método `find`, usar CRUD base
    if (!controller.find) {
      controller = { ...generateCrudController(pluralEntity) };
    }

    // Rutas CRUD básicas
    if (controller.find) {
      router.get(`${basePath}`, controller.find);
      router.get(`${basePath}/:id`, controller.findOne);
      router.post(`${basePath}`, controller.create);
      router.put(`${basePath}/:id`, controller.update);
      router.delete(`${basePath}/:id`, controller.deleteOne);

      console.log(`✅ CRUD loaded: [GET, POST, PUT, DELETE] ${basePath}`);
    }

    try {
      const controllerFiles = await fs.readdir(controllersPath);
      for (const file of controllerFiles) {
        if (file.endsWith(".js")) {
          const controllerFileURL = pathToFileURL(
            path.join(controllersPath, file)
          ).href;
          const ctrlModule = await import(controllerFileURL);
          Object.assign(controller, ctrlModule.default || {});
        }
      }
    } catch {
      console.warn(`⚠️  No controller folder for: ${entity}`);
    }

    if (!controller.find) {
      controller = { ...generateCrudController(pluralEntity) };
    }

    // 💾 Registrar globalmente
    Registry.controllers[entity] = controller;

    const servicesPath = path.join(entityPath, "services");
    let service = {};

    try {
      const serviceFiles = await fs.readdir(servicesPath);
      for (const file of serviceFiles) {
        if (file.endsWith(".js")) {
          const serviceFileURL = pathToFileURL(
            path.join(servicesPath, file)
          ).href;
          const serviceModule = await import(serviceFileURL);
          Object.assign(service, serviceModule.default || {});
        }
      }
    } catch {
      console.warn(`⚠️  No service folder for: ${entity}`);
    }

    // 💾 Registrar globalmente
    Registry.services[entity] = service;
    /** =====================
     * LOAD CUSTOM ROUTES
     =======================*/
    try {
      const routeFiles = await fs.readdir(routesPath);

      for (const file of routeFiles) {
        if (!file.endsWith(".js")) continue;

        const routeFileURL = pathToFileURL(path.join(routesPath, file)).href;
        const routeModule = await import(routeFileURL);
        const customRoutes = routeModule.default || [];

        for (const route of customRoutes) {
          const { method, path: routePath, handler, middleware = [] } = route;
          const [ctrlName, methodName] = handler.split(".");

          const handlerFn = controller[methodName];

          if (typeof handlerFn !== "function") {
            console.warn(`⚠️  Handler not found: ${handler}`);
            continue;
          }

          const fullPath = `/api/${pluralEntity}${routePath}`;

          // Si hay middleware, lo pasamos antes del handler
          if (middleware.length > 0) {
            router[method.toLowerCase()](fullPath, ...middleware, handlerFn);
          } else {
            router[method.toLowerCase()](fullPath, handlerFn);
          }

          console.log(
            `✅ Custom route loaded: [${method.toUpperCase()}] ${fullPath}`
          );
        }
      }
    } catch (error) {
      console.log(`ℹ️  No custom routes for ${entity}`, error.message);
    }
  }
};

await loadRoutes();

export default router;
