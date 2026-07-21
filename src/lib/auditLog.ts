import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export type AuditAction =
  | "user_created"
  | "user_updated"
  | "user_deleted"
  | "iframe_changed"
  | "role_changed"
  | "user_signed_in"
  | "google_sheet_changed"
  | "password_changed";

/**
 * Write a structured audit log entry to the `auditLogs` Firestore collection.
 *
 * @param action    The type of action being performed.
 * @param operator  The user who performed the action.
 * @param target    The user/resource that was affected.
 * @param details   Action-specific key/value metadata.
 */
export async function writeAuditLog(
  action: AuditAction,
  operator: { uid: string; email: string },
  target: { email: string; uid?: string },
  details: Record<string, string> = {}
): Promise<void> {
  try {
    await addDoc(collection(db, "auditLogs"), {
      action,
      operatorUid: operator.uid,
      operatorEmail: operator.email,
      targetEmail: target.email,
      targetUid: target.uid ?? "",
      details,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    // Audit log failures must never break the main operation
    console.error("[auditLog] Failed to write audit entry:", err);
  }
}
