/* eslint-disable @typescript-eslint/no-var-requires */
import { spawnSync } from "child_process";
// import fs from "fs";
// import path from "path";

import pkg from "../package.json";

const argv = process.argv.slice(2);

// const ROOT = path.resolve(__dirname, "..");

/**
 * Clean up package.json
 */
const pkgClone: Partial<typeof pkg> = {
  ...pkg,
};

delete pkgClone.dependencies;
delete pkgClone.devDependencies;
delete pkgClone.files;
delete pkgClone.scripts;
delete pkgClone["lint-staged"];
delete pkgClone.publishConfig;

// fs.writeFileSync(
//   path.resolve(ROOT, "package.json"),
//   JSON.stringify(pkgClone, null, 2)
// );

/**
 * Execute release
 */
spawnSync("yarn", ["release-it", ...argv], {
  stdio: "inherit",
});

/**
 * Restore package.json
 */
// fs.writeFileSync(
//   path.resolve(ROOT, "package.json"),
//   JSON.stringify(pkg, null, 2)
// );
