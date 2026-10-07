// Loads the DragonBall and Naruto character datasets into MongoDB.
// Replaces the old pandas uploaders (dataset/uploader.ipynb, naruto_dataset/uploader.py),
// which posted the same rows to the /createcharacters endpoints.
// Usage: npm run seed   (uses DATABASE from .env)
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const DragonBall_Character = require("../Models/dragonball/dragonball_character");
const Naruto_Character = require("../Models/naruto/naruto_character");

// Characters the original Naruto uploader left out
const NARUTO_EXCLUDED = ["Yura", "Fourth Mizukage", "Utakata", "Yukimaru"];

const parseCsv = (file) => {
  // The CSVs were saved from Excel on Windows (cp1252), so read them as latin1
  const text = fs.readFileSync(file, "latin1");
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...data] = rows;
  return data
    .filter((r) => r[0])
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
};

const toCharacter = (row) => ({
  name: row.name,
  url: row.url,
  theme: row.theme,
  attack: Number(row.attack),
  defence: Number(row.defence),
  health: Number(row.health),
  total_health: Number(row.total_health),
  base_price: Number(row.base_price),
  stamina: Number(row.stamina),
  stamina_threshold: Number(row.stamina_threshold),
  transformable: ["TRUE", "1"].includes(row.transformable.trim().toUpperCase()),
  next_character: row.next_character || "",
  dp: row.dp,
});

const seed = async () => {
  if (!process.env.DATABASE) throw new Error("DATABASE is not set in .env");
  await mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dragonball = parseCsv(path.join(__dirname, "..", "dataset", "characters.csv")).map(toCharacter);
  const naruto = parseCsv(path.join(__dirname, "..", "naruto_dataset", "dataset.csv"))
    .filter((row) => !NARUTO_EXCLUDED.includes(row.name))
    .map(toCharacter);

  await DragonBall_Character.deleteMany();
  await DragonBall_Character.insertMany(dragonball);
  await Naruto_Character.deleteMany();
  await Naruto_Character.insertMany(naruto);

  console.log(`Seeded ${dragonball.length} DragonBall and ${naruto.length} Naruto characters`);
};

if (require.main === module) {
  seed()
    .catch((err) => {
      console.error("Seeding failed:", err.message);
      process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
}

module.exports = { parseCsv, toCharacter };
