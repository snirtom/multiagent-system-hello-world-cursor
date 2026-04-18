/**
 * Non-interactive EAS Android APK build.
 * Requires EXPO_TOKEN (see https://expo.dev/accounts/[account]/settings/access-tokens )
 * or set EXPO_TOKEN in .env.local (gitignored).
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(projectRoot, ".env.local");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

function sh(cmd) {
  execSync(cmd, { stdio: "inherit", cwd: projectRoot, env: process.env });
}

function readAppJson() {
  const p = path.join(projectRoot, "app.json");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function getProjectId(appJson) {
  return appJson?.expo?.extra?.eas?.projectId ?? null;
}

loadEnvLocal();

if (!process.env.EXPO_TOKEN) {
  console.error(`
Missing EXPO_TOKEN. I cannot log into Expo on your behalf from this environment.

Do this once:
  1. Open https://expo.dev → your account → Access tokens → create a token.
  2. In PowerShell (same window you use to build):
       $env:EXPO_TOKEN = "paste_token_here"

  Or create mobile-android/.env.local with a single line:
       EXPO_TOKEN=paste_token_here

Then run again:
  npm run build:apk
`);
  process.exit(1);
}

sh("npx eas whoami");

const before = readAppJson();
if (!getProjectId(before)) {
  console.log("Linking this folder to an EAS project (first run only)…");
  sh("npx eas init --non-interactive");
}

console.log("Starting cloud build: Android APK (profile: preview)…");
sh("npx eas build --platform android --profile preview --non-interactive");

console.log(`
When the build finishes, open your project on https://expo.dev and download the APK from Builds.
`);
