// Downloads the reference images into /public/images for self-hosting.
// Run only after confirming you have the right to use them commercially,
// then set USE_LOCAL_IMAGES = true in lib/images.ts.
import { mkdir, writeFile } from "node:fs/promises";

const ids = {
  hero: "1549465220-1a8b9238cd48",
  executive: "1513201099705-a9746e1e201f",
  bespoke: "1607082348824-0a96f2a4b9da",
  moments: "1492684223066-81342ee5ff30",
  unboxing: "1607344645866-009c320b63e0",
  leadership: "1523275335684-37898b6baf30",
  employee: "1497366754035-f200968a6e72",
  cta: "1512909006721-3d6018887383",
};

await mkdir("public/images", { recursive: true });
for (const [key, id] of Object.entries(ids)) {
  const url = `https://images.unsplash.com/photo-${id}?fm=jpg&fit=crop&q=85&w=2400`;
  const res = await fetch(url);
  if (!res.ok) { console.error(`✗ ${key}: HTTP ${res.status}`); continue; }
  await writeFile(`public/images/${key}.jpg`, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${key}`);
}
