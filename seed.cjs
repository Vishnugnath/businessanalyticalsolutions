/**
 * Samagra BAS — Firestore Database Seeder (REST-based, no service account required)
 *
 * Uses Firebase Auth REST API to sign in as superadmin, then writes seed
 * documents to Firestore via the Firestore REST API.
 *
 * Usage: node seed.cjs
 */

const https = require("https");
const readline = require("readline");

const API_KEY    = "AIzaSyBvYphVqHZpCxC9JoJbcWN8fNeI4o-sanE";
const PROJECT_ID = "space-samagra";

const DEFAULT_IFRAME = "https://app.powerbi.com/view?r=eyJrIjoiMGMwYTQyNzMtYWE5MC00MThmLWI5MTQtOTQzMWM3MDlmNWQ1IiwidCI6ImU0YTk2Y2RmLTBlYTItNDliNS1hYjRiLWU3MmJkYzNhYTI4NiIsImMiOjEwfQ%3D%3D";

const SEED_USERS = [
  { key: "admin@samagra.com",               role: "admin", iframeUrl: "",             pendingSignup: true },
  { key: "client1@samagra.com",             role: "user",  iframeUrl: DEFAULT_IFRAME, pendingSignup: true },
  { key: "client2@samagra.com",             role: "user",  iframeUrl: DEFAULT_IFRAME, pendingSignup: true },
  { key: "dataanalyst.samagra@gmail.com",   role: "user",  iframeUrl: DEFAULT_IFRAME, pendingSignup: true },
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

function httpRequest(method, hostname, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const headers = { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) };
    if (token) headers["Authorization"] = "Bearer " + token;
    const req = https.request({ hostname, path, method, headers }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function toFsValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number")  return { integerValue: String(val) };
  if (typeof val === "string")  return { stringValue: val };
  if (typeof val === "object")  return {
    mapValue: { fields: Object.fromEntries(Object.entries(val).map(([k, v]) => [k, toFsValue(v)])) }
  };
  return { stringValue: String(val) };
}

function buildDoc(obj) {
  return { fields: Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toFsValue(v)])) };
}

async function main() {
  console.log("\n==============================================");
  console.log("  Samagra BAS - Firestore Database Seeder");
  console.log("==============================================\n");
  console.log("Project: " + PROJECT_ID + "\n");

  const email    = await ask("Superadmin Email: ");
  const password = await ask("Superadmin Password: ");
  rl.close();

  process.stdout.write("\nSigning in...");
  const authRes = await httpRequest(
    "POST",
    "identitytoolkit.googleapis.com",
    "/v1/accounts:signInWithPassword?key=" + API_KEY,
    { email: email.trim(), password, returnSecureToken: true }
  );

  if (authRes.status !== 200 || !authRes.body.idToken) {
    const msg = (authRes.body && authRes.body.error && authRes.body.error.message) || JSON.stringify(authRes.body);
    console.error("\n\nSign-in failed: " + msg);
    process.exit(1);
  }

  const idToken = authRes.body.idToken;
  console.log(" Authenticated as " + authRes.body.email);
  console.log("\nSeeding documents...");

  for (const u of SEED_USERS) {
    const docPath = "/v1/projects/" + PROJECT_ID + "/databases/(default)/documents/users/" + encodeURIComponent(u.key);
    const docBody = buildDoc({ email: u.key, role: u.role, iframeUrl: u.iframeUrl, pendingSignup: u.pendingSignup });
    const res = await httpRequest("PATCH", "firestore.googleapis.com", docPath, docBody, idToken);
    if (res.status === 200) {
      console.log("  + users/" + u.key + "  (" + u.role + ")");
    } else {
      const errMsg = (res.body && res.body.error && res.body.error.message) || JSON.stringify(res.body);
      console.error("  x users/" + u.key + " -- " + res.status + ": " + errMsg);
    }
  }

  console.log("\nSeeding complete!\n");
}

main().catch((err) => {
  console.error("\nUnexpected error:", err.message || err);
  process.exit(1);
});
