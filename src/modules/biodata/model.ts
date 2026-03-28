import { t } from "elysia";

export const BiodataStyle = t.Object({
  lightColor: t.Optional(t.String()),
  darkColor: t.Optional(t.String()),
  fontFamily: t.Optional(t.String()),
  bgColor: t.Optional(t.String()),
});

export const BiodataResponse = t.Object({
  id: t.String(),
  alias: t.String(),
  name: t.String(),
  npm: t.String(),
  description: t.String(),
  photo: t.String(),
  email: t.String(),
  linkedin: t.String(),
  github: t.String(),
  downloadCv: t.String(),
  portofolio: t.String(),
  skills: t.Array(t.String()),
  style: t.Object({
    lightColor: t.String(),
    darkColor: t.String(),
    fontFamily: t.String(),
    bgColor: t.String(),
  }),
});

export const EditBiodataBody = t.Object({
  name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
  npm: t.Optional(t.String()),
  description: t.Optional(t.String({ maxLength: 500 })),
  photo: t.Optional(t.String()),
  email: t.Optional(t.String()),
  linkedin: t.Optional(t.String()),
  github: t.Optional(t.String()),
  downloadCv: t.Optional(t.String()),
  portofolio: t.Optional(t.String()),
  skills: t.Optional(t.Array(t.String())),
  style: t.Optional(BiodataStyle),
});

export type BiodataStyle = typeof BiodataStyle.static;
export type BiodataResponse = typeof BiodataResponse.static;
export type EditBiodataBody = typeof EditBiodataBody.static;
