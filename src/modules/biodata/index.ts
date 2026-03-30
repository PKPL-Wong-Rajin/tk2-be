import { Elysia, t, status } from "elysia";
import { jwtPlugin } from "../../plugins/jwt";
import { db } from "../../database";
import { biodatas } from "../../database/schema";
import { eq } from "drizzle-orm";
import {
  BiodataResponse,
  EditBiodataBody,
} from "./model";

export const biodataController = new Elysia({ prefix: "/biodata" })
  .use(jwtPlugin)
  .get(
    "/",
    async () => {
      const results = await db.select().from(biodatas);
      return results;
    },
    {
      response: {
        200: t.Array(BiodataResponse),
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const [biodata] = await db.select().from(biodatas).where(eq(biodatas.id, id)).limit(1);
      if (!biodata) return status(404, { message: "Biodata not found" });

      return biodata;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: BiodataResponse,
        404: t.Object({ message: t.String() }),
      },
    },
  )
  .put(
    "/:id",
    async ({ params: { id }, body, jwt, cookie: { auth } }) => {
      if (!auth.value) return status(401, { message: "Authentication required" });

      const payload = await jwt.verify(auth.value as string);
      if (!payload) return status(401, { message: "Invalid or expired token" });

      const [biodata] = await db.select().from(biodatas).where(eq(biodatas.id, id)).limit(1);
      if (!biodata) return status(404, { message: "Biodata not found" });

      if (payload.email !== biodata.email) {
        return status(403, {
          message: "You do not have permission to edit this biodata",
        });
      }

      const updateData: Partial<typeof biodatas.$inferInsert> = {};
      if (body.name !== undefined) updateData.name = body.name;
      if (body.npm !== undefined) updateData.npm = body.npm;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.photo !== undefined) updateData.photo = body.photo;
      if (body.email !== undefined) updateData.email = body.email;
      if (body.linkedin !== undefined) updateData.linkedin = body.linkedin;
      if (body.github !== undefined) updateData.github = body.github;
      if (body.downloadCv !== undefined) updateData.downloadCv = body.downloadCv;
      if (body.portofolio !== undefined) updateData.portofolio = body.portofolio;
      if (body.skills !== undefined) updateData.skills = body.skills;

      if (body.style) {
        updateData.style = { ...biodata.style, ...body.style };
      }

      if (Object.keys(updateData).length > 0) {
        await db.update(biodatas).set(updateData).where(eq(biodatas.id, id));
      }

      const [updatedBiodata] = await db.select().from(biodatas).where(eq(biodatas.id, id)).limit(1);
      return updatedBiodata;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: EditBiodataBody,
      response: {
        200: BiodataResponse,
        401: t.Object({ message: t.String() }),
        403: t.Object({ message: t.String() }),
        404: t.Object({ message: t.String() }),
      },
    },
  );
