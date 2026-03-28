import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { authController } from "./modules/auth";
import { biodataController } from "./modules/biodata";

const app = new Elysia()
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    }),
  )
  .get("/", () => ({ message: "PKPL TK-2 Biodata API", status: "ok" }))
  .use(authController)
  .use(biodataController)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
