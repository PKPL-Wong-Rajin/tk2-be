import { Elysia, t, status } from "elysia";
import { biodataList } from "./data";
import { jwtPlugin } from "../../plugins/jwt";
import {
  BiodataResponse,
  EditBiodataBody,
  type EditBiodataBody as EditBiodataBodyType,
} from "./model";

export const biodataController = new Elysia({ prefix: "/biodata" })
  .use(jwtPlugin)
  .get(
    "/",
    () => {
      return biodataList;
    },
    {
      response: {
        200: t.Array(BiodataResponse),
      },
    },
  )
  .get(
    "/:id",
    ({ params: { id } }) => {
      const biodata = biodataList.find((b) => b.id === id);
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

      const payload = await jwt.verify(auth.value);
      if (!payload) return status(401, { message: "Invalid or expired token" });

      const biodata = biodataList.find((b) => b.id === id);
      if (!biodata) return status(404, { message: "Biodata not found" });

      if (payload.email !== biodata.email) {
        return status(403, {
          message: "You do not have permission to edit this biodata",
        });
      }

      applyBiodataEdits(biodata, body);

      return biodata;
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

function applyBiodataEdits(
  biodata: (typeof biodataList)[number],
  body: EditBiodataBodyType,
): void {
  if (body.name !== undefined) biodata.name = body.name;
  if (body.npm !== undefined) biodata.npm = body.npm;
  if (body.description !== undefined) biodata.description = body.description;
  if (body.photo !== undefined) biodata.photo = body.photo;
  if (body.email !== undefined) biodata.email = body.email;
  if (body.linkedin !== undefined) biodata.linkedin = body.linkedin;
  if (body.github !== undefined) biodata.github = body.github;
  if (body.downloadCv !== undefined) biodata.downloadCv = body.downloadCv;
  if (body.portofolio !== undefined) biodata.portofolio = body.portofolio;
  if (body.skills !== undefined) biodata.skills = body.skills;

  if (body.style) {
    if (body.style.lightColor !== undefined) biodata.style.lightColor = body.style.lightColor;
    if (body.style.darkColor !== undefined) biodata.style.darkColor = body.style.darkColor;
    if (body.style.fontFamily !== undefined) biodata.style.fontFamily = body.style.fontFamily;
    if (body.style.bgColor !== undefined) biodata.style.bgColor = body.style.bgColor;
  }
}
