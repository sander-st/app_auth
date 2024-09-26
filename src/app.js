import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { router } from "./routes/index.js";

// config
const app = express();
const port = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// routes
app.use(router);

// start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
