export type DraftAttachmentSnapshot = {
  id: string;
  filename: string;
  mediaType: string;
  type: "file";
  url: string;
};

export type ThreadDraftSnapshot = {
  text: string;
  attachments: DraftAttachmentSnapshot[];
};

const LANDING_THREAD_KEY = "__landing__";
const draftStore = new Map<string, ThreadDraftSnapshot>();

function cloneSnapshot(snapshot: ThreadDraftSnapshot): ThreadDraftSnapshot {
  return {
    attachments: snapshot.attachments.map((attachment) => ({ ...attachment })),
    text: snapshot.text,
  };
}

export function createThreadDraftKey(threadId: string | null | undefined) {
  return threadId?.trim() || LANDING_THREAD_KEY;
}

export function getThreadDraftSnapshot(threadKey: string) {
  const snapshot = draftStore.get(threadKey);
  return snapshot ? cloneSnapshot(snapshot) : undefined;
}

export function saveThreadDraftSnapshot(threadKey: string, snapshot: ThreadDraftSnapshot) {
  draftStore.set(threadKey, cloneSnapshot(snapshot));
}

export function clearThreadDraftSnapshot(threadKey: string) {
  draftStore.delete(threadKey);
}
