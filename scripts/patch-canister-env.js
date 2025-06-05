import fs from "fs";
import path from "path";

const FILE = path.resolve("src/declarations/backend/index.js");

fs.readFile(FILE, "utf8", (err, data) => {
  if (err) throw err;

  const updated = data.replace(
    /process\.env\.CANISTER_ID_BACKEND/g,
    "process.env.NEXT_PUBLIC_CANISTER_ID_BACKEND"
  );

  fs.writeFile(FILE, updated, "utf8", (err) => {
    if (err) throw err;
    console.log("✅ Patched NEXT_PUBLIC_ in canister env var.");
  });
});
