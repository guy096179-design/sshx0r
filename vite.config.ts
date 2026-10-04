import { execSync } from "node:child_process";

import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

function getCommitHash(): string {
  try {
    return execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return (
      process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 7) ??
      process.env.GIT_COMMIT_SHA?.slice(0, 7) ??
      "unknown"
    );
  }
}

const commitHash = getCommitHash();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify("0.4.1-" + commitHash),
  },

  plugins: [sveltekit()],

  server: {
    proxy: {
      "/api": {
        target: "http://[::1]:8051",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
