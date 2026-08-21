const FREE_MONTHLY_UPLOAD_LIMIT = 2;

function effectiveCount(data, currentMonth) {
  const sameMonth = data.resetMonth === currentMonth;
  return sameMonth ? (data.uploadCount || 0) : 0;
}

/**
 * Server-side source of truth for the free-tier upload quota (read-only —
 * call before doing the expensive Gemini call, so an over-quota user
 * doesn't cost you an API call just to be rejected). Throws (with
 * .statusCode = 403) if the quota is already used up and the user isn't Pro.
 */
export async function checkUploadQuota(db, uid) {
  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  const data = snap.exists ? snap.data() : {};
  const isPro = !!data.isPro;
  const currentMonth = new Date().getMonth();

  if (!isPro && effectiveCount(data, currentMonth) >= FREE_MONTHLY_UPLOAD_LIMIT) {
    const err = new Error("You've used your 2 free statement uploads this month. Upgrade to Pro or wait until next month.");
    err.statusCode = 403;
    throw err;
  }
}

/**
 * Commits one upload against the quota. Call this only after a statement
 * has been successfully parsed — a failed/garbled parse shouldn't cost the
 * user one of their free uploads. Runs as a transaction so concurrent
 * requests from the same user can't race past the limit.
 */
export async function incrementUploadCount(db, uid) {
  const userRef = db.collection('users').doc(uid);
  const currentMonth = new Date().getMonth();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.exists ? snap.data() : {};
    const newCount = effectiveCount(data, currentMonth) + 1;
    tx.set(userRef, { uploadCount: newCount, resetMonth: currentMonth }, { merge: true });
  });
}
