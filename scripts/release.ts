/* eslint-disable @typescript-eslint/no-var-requires */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

import pkg from "../package.json";

const argv = process.argv.slice(2);

const ROOT = path.resolve(__dirname, "..");
const PKG_JSON_PATH = path.resolve(ROOT, "package.json");

/**
 * Clean up package.json
 */
const pkgClone: Partial<typeof pkg> = {
  ...pkg,
};

delete pkgClone.devDependencies;
delete pkgClone.scripts;

fs.writeFileSync(
  PKG_JSON_PATH,
  [JSON.stringify(pkgClone, null, 2), "\n"].join("")
);

/**
 * Execute release
 */
try {
  spawnSync("yarn", ["release-it", ...argv], {
    stdio: "inherit",
  });

  spawnSync("git", ["reset", "--soft", "HEAD~1"], {
    stdio: "inherit",
  });
  spawnSync("git", ["restore", "--staged", PKG_JSON_PATH], {
    stdio: "inherit",
  });
  spawnSync("git", ["commit", "-c", "ORIG_HEAD"], {
    stdio: "inherit",
  });
} catch (e) {
  console.error(e);
  fs.writeFileSync(
    PKG_JSON_PATH,
    [JSON.stringify(pkg, null, 2), "\n"].join("")
  );
}
