import { db } from "./index";
import { biodatas } from "./schema";
import { biodataList } from "../modules/biodata/data";

async function main() {
  console.log("Seeding biodata...");
  try {
    for (const data of biodataList) {
      await db.insert(biodatas).values({
        id: data.id,
        alias: data.alias,
        name: data.name,
        npm: data.npm,
        description: data.description,
        photo: data.photo,
        email: data.email,
        linkedin: data.linkedin,
        github: data.github,
        downloadCv: data.downloadCv,
        portofolio: data.portofolio,
        skills: data.skills,
        style: data.style,
      }).onConflictDoUpdate({
        target: biodatas.id,
        set: {
          alias: data.alias,
          name: data.name,
          npm: data.npm,
          description: data.description,
          photo: data.photo,
          email: data.email,
          linkedin: data.linkedin,
          github: data.github,
          downloadCv: data.downloadCv,
          portofolio: data.portofolio,
          skills: data.skills,
          style: data.style,
        },
      });
    }
    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding biodatas:", err);
  } finally {
    process.exit(0);
  }
}

main();
