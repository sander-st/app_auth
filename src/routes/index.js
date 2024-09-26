import { Router } from "express";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { readdirSync } from "node:fs";

const router = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

const routesFiles = readdirSync(__dirname);

routesFiles.forEach((filename) => {
  // quitar la extension .js
  const cleanExt = filename.replace(/\.js$/, "");
  if (cleanExt !== "index") {
    import(`./${filename}`).then((moduleRouter) => {
      router.use(`/api/${cleanExt}`, moduleRouter.router);
    });
  }
});

export { router };
