#!/usr/bin/env ts-node-script
import { clean } from "esbuild-plugin-clean";
import * as esbuild from "esbuild";

esbuild.build({
  format: "cjs",
  platform: "node",
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/index.js",
  sourcemap: true,
  plugins: [clean({ patterns: ["./dist/*"] })],
});
