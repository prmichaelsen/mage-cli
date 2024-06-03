#!/usr/bin/env ts-node-script
import * as esbuild from "esbuild";
import { clean } from "esbuild-plugin-clean";

const run = async () => {
  const ctx = await esbuild.context({
    format: "iife",
    platform: "node",
    entryPoints: ["./src/**/*"],
    outdir: "./dist/",
    sourcemap: true,
    bundle: true,
    plugins: [
      clean({ patterns: ["./dist/*"] }),
      {
        name: "rebuild-notify",
        setup(build) {
          build.onStart(() => {
            console.log("Building...");
          });
          build.onEnd((result) => {
            console.log(
              "Build complete with " + result.errors.length + " errors."
            );
          });
        },
      },
    ],
  });
  await ctx.watch();
};

run();
