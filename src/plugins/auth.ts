import { Elysia } from "elysia";
import { jwtPlugin } from "./jwt";

export const authPlugin = new Elysia({ name: "Auth.Plugin" })
  .use(jwtPlugin)
  .macro({
    isAuth: {
      async resolve({ jwt, cookie: { auth }, status }) {
        if (!auth.value) return status(401);

        const payload = await jwt.verify(auth.value);
        if (!payload) return status(401);

        return {
          user: {
            id: payload.sub as string,
            email: payload.email as string,
          },
        };
      },
    },
  });
