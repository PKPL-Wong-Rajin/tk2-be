import { Elysia, t, status } from "elysia";
import { AuthModel, AuthResponse, ErrorResponse } from "./model";
import { AuthService, isServiceError } from "./service";
import { jwtPlugin } from "../../plugins/jwt";

export const authController = new Elysia({ prefix: "/auth" })
  .use(AuthModel)
  .use(jwtPlugin)
  .post(
    "/google",
    async ({ body, jwt, cookie: { auth } }) => {
      // 1. Verify Google credential (ID token)
      const googlePayload = await AuthService.verifyGoogleToken(
        body.credential,
      );

      if (isServiceError(googlePayload)) {
        return status(
          googlePayload.status as 401,
          { message: googlePayload.message },
        );
      }

      // 2. Find or create user in our database
      const user = await AuthService.findOrCreateByGoogle(googlePayload);

      if (isServiceError(user)) {
        return status(500, { message: "Failed to create user account" });
      }

      // 3. Issue our own JWT session token
      const token = await jwt.sign({
        sub: user.id,
        email: user.email,
      });

      auth.set({
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 86400, // 7 days
        path: "/",
      });

      return user;
    },
    {
      body: "auth.google-login",
      response: {
        200: AuthResponse,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
  )
  .get(
    "/me",
    async ({ jwt, cookie: { auth } }) => {
      if (!auth.value) {
        return status(401, { message: "Not authenticated" });
      }

      const payload = await jwt.verify(auth.value);
      if (!payload) {
        return status(401, { message: "Invalid or expired session" });
      }

      const user = await AuthService.findById(payload.sub as string);
      if (isServiceError(user)) {
        return status(401, { message: "User not found" });
      }

      return user;
    },
    {
      response: {
        200: AuthResponse,
        401: ErrorResponse,
      },
    },
  )
  .post(
    "/logout",
    ({ cookie: { auth } }) => {
      auth.remove();
      return { message: "Logged out successfully" };
    },
    {
      response: {
        200: t.Object({ message: t.String() }),
      },
    },
  );
