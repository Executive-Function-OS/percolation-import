"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOldValidationData = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
// Scheduled Cloud Function that runs daily at 2:00 AM to delete validation data older than 90 days
exports.deleteOldValidationData = (0, scheduler_1.onSchedule)("0 2 * * *", async () => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90); // IRB 90-day retention period
    try {
        const querySnapshot = await db
            .collectionGroup("validation")
            .where("completion_date", "<", cutoff.toISOString())
            .get();
        if (querySnapshot.empty) {
            console.log("No old validation data to purge.");
            return;
        }
        console.log(`Found ${querySnapshot.size} validation document(s) older than 90 days. Committing batch deletion...`);
        const batch = db.batch();
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        console.log("Batch deletion committed successfully.");
    }
    catch (error) {
        console.error("Error during scheduled validation data cleanup:", error);
    }
});
//# sourceMappingURL=index.js.map