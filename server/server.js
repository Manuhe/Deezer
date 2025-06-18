import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import router from "./src/router/index.js";
import { server as serverConfig } from "./config/server.js";
import { initOracleConnection } from "./config/database.js";
import { parseQuery } from "./src/middlewares/parseQuery.js";
import { generateEntityStructure } from "./core/generateEntityStructure.js";
import { Registry } from "./config/registry.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(parseQuery);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

await initOracleConnection();
await generateEntityStructure();

app.use("/api", router);

app.listen(serverConfig.port, () => {
  const url = `http://localhost:${serverConfig.port}`;
  const clickableUrl = `\x1b]8;;${url}\x1b\\${url}\x1b]8;;\x1b\\`;

  console.log("\n==============================");
  console.log("       🚀 Server Started       ");
  console.log("==============================");
  console.log(`Server: Express API`);
  console.log(`URL:    ${clickableUrl}`);
  console.log("==============================\n");
});
