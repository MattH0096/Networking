import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2];
const files = (await readdir(dir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
const counts = new Map();

for (const name of files) {
  const { width, height } = await sharp(path.join(dir, name)).metadata();
  const key = `${width}x${height}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

for (const [size, count] of [...counts].sort((a, b) => b[1] - a[1])) {
  console.log(`${size.padEnd(12)} ${count}`);
}
