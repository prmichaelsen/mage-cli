#!/usr/bin/env ts-node-script
import * as esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";
import path from "node:path";

let makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      external: true,
    }));
  },
};

esbuild.build({
  format: "cjs",
  platform: "node",
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: true,
  outfile: "./dist/index.js",
  plugins: [clean({ patterns: ["./dist/*"] }), makeAllPackagesExternalPlugin],
});
