const admin = require("firebase-admin");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("=========================================");
  console.log(" Firebase First Superadmin Bootstrap Script");
  console.log("=========================================\n");

  const serviceAccountPath = await question(
    "Enter the path to your Firebase Service Account JSON file (or press Enter if using GOOGLE_APPLICATION_CREDENTIALS): "
  );

  let credential = null;
  if (serviceAccountPath.trim()) {
    const resolvedPath = path.resolve(serviceAccountPath.trim());
    if (!fs.existsSync(resolvedPath)) {
      console.error(`Error: Service account file not found at ${resolvedPath}`);
      process.exit(1);
    }
    const serviceAccount = require(resolvedPath);
    credential = admin.credential.cert(serviceAccount);
  } else {
    credential = admin.credential.applicationDefault();
  }

  const projectId = await question("Enter your Firebase Project ID (e.g. space-samagra): ");
  if (!projectId.trim()) {
    console.error("Error: Project ID is required.");
    process.exit(1);
  }

  admin.initializeApp({
    credential,
    projectId: projectId.trim(),
  });

  const db = admin.firestore();

  const uid = await question("Enter the User ID (UID) of the user to promote: ");
  if (!uid.trim()) {
    console.error("Error: User ID is required.");
    process.exit(1);
  }

  const email = await question("Enter the Email of the user: ");
  if (!email.trim()) {
    console.error("Error: Email is required.");
    process.exit(1);
  }

  console.log(`\nPromoting user ${email} (${uid}) to superadmin in project ${projectId}...`);

  try {
    const userRef = db.collection("users").doc(uid.trim());
    await userRef.set(
      {
        email: email.trim().toLowerCase(),
        role: "superadmin",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log("\nSuccess! The user document has been created/updated with the 'superadmin' role.");
    console.log("Firestore Path: users/" + uid.trim());
  } catch (error) {
    console.error("\nFailed to bootstrap superadmin:", error);
  } finally {
    rl.close();
  }
}

main().catch(console.error);
