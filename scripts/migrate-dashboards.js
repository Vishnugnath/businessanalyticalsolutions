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
  console.log(" User Dashboards Firestore Migration Script");
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

  console.log("\nReading user_dashboards collection...");
  const dashSnap = await db.collection("user_dashboards").get();
  console.log(`Found ${dashSnap.size} mappings to migrate.`);

  let updatedCount = 0;
  let createdCount = 0;

  for (const dashDoc of dashSnap.docs) {
    const dashData = dashDoc.data();
    const emailLower = (dashData.email || dashDoc.id).trim().toLowerCase();
    const iframeUrl = dashData.iframeUrl || "";
    const updatedAt = dashData.updatedAt || admin.firestore.FieldValue.serverTimestamp();

    // Look for existing user document with this email
    const userQuerySnap = await db
      .collection("users")
      .where("email", "==", emailLower)
      .get();

    if (!userQuerySnap.empty) {
      // User doc exists (already signed up), update in-place
      const existingUserDoc = userQuerySnap.docs[0];
      await existingUserDoc.ref.set(
        {
          iframeUrl,
          updatedAt,
        },
        { merge: true }
      );
      console.log(`[MERGE] Merged dashboard into existing user account: ${emailLower} (ID: ${existingUserDoc.id})`);
      updatedCount++;
    } else {
      // User doc does not exist, create pending doc keyed by email
      await db.collection("users").doc(emailLower).set({
        email: emailLower,
        role: "user",
        iframeUrl,
        pendingSignup: true,
        createdAt: updatedAt,
        updatedAt: updatedAt,
      });
      console.log(`[CREATE PENDING] Created pending signup user record: ${emailLower}`);
      createdCount++;
    }
  }

  console.log("\n=========================================");
  console.log(" Migration Complete!");
  console.log(` Consolidated: ${updatedCount + createdCount} records`);
  console.log(` - Merged into existing users: ${updatedCount}`);
  console.log(` - Created pending signup placeholders: ${createdCount}`);
  console.log("=========================================\n");

  const deleteConfirm = await question(
    "Would you like to delete the source 'user_dashboards' collection now? (yes/no): "
  );

  if (deleteConfirm.trim().toLowerCase() === "yes" || deleteConfirm.trim().toLowerCase() === "y") {
    console.log("Deleting user_dashboards documents...");
    const batch = db.batch();
    dashSnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log("Source collection successfully deleted.");
  } else {
    console.log("Keep-intact: user_dashboards collection left untouched.");
  }

  rl.close();
}

main().catch((err) => {
  console.error("\nMigration failed:", err);
  rl.close();
});
