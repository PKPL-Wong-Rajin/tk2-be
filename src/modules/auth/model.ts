import { Elysia, t } from "elysia";

export const GoogleLoginBody = t.Object({
  credential: t.String({ minLength: 1 }),
});

export const AuthResponse = t.Object({
  id: t.String(),
  googleId: t.String(),
  username: t.String(),
  email: t.String(),
});

export const ErrorResponse = t.Object({
  message: t.String(),
});

export type GoogleLoginBody = typeof GoogleLoginBody.static;
export type AuthResponse = typeof AuthResponse.static;

export const AuthModel = new Elysia({ name: "Auth.Model" }).model({
  "auth.google-login": GoogleLoginBody,
  "auth.response": AuthResponse,
  "auth.error": ErrorResponse,
});
