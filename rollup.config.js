/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import * as path from "path";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import builtins from "builtin-modules";
import typescript from "rollup-plugin-typescript2";

const isDev = process.env.NODE_ENV === "development";

const pkg = require(path.resolve("package.json"));

const input = pkg.entries || "src/index.ts";

const plugins = [
  resolve(),
  commonjs(),
  json(),
  typescript({
    typescript: require("typescript"),
    clean: true,
    useTsconfigDeclarationDir: true,
  }),
];

export default {
  input,
  output: [output("cjs", "main"), output("es", "module"), output("umd", "umd")],
  plugins,
  external: [...builtins],
};

function output(format) {
  const isUMDProd = !isDev && format === "umd";

  return {
    dir: `lib/${format}`,
    name: "ConcurrentTasks",
    format,
    sourcemap: isDev,
    exports: "auto",
    plugins: [
      !isDev &&
        terser({
          mangle: isUMDProd,
          compress: isUMDProd,
          format: {
            beautify: !isUMDProd,
          },
        }),
    ],
  };
}
