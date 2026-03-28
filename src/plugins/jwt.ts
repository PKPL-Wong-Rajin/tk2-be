import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

export const jwtPlugin = new Elysia({ name: "Jwt.Shared" }).use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET || "3cK7LFsFeOmsWuwcmX1SpLpYZj03xm7giuyH",
    exp: "7d",
  }),
);
