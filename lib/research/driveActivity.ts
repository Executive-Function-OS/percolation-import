import type { NormalizedActivity } from "./types";

/** Google Drive Activity API v2 — response shapes vary; we parse defensively. */

function pickTitle(target: Record<string, unknown>): string {
  const driveItem = target.driveItem as Record<string, unknown> | undefined;
  const name =
    (target.title as string) ||
    (driveItem?.title as string) ||
    (driveItem?.name as string) ||
    "unknown";
  return String(name);
}

function pickFileId(target: Record<string, unknown>): string {
  const driveItem = target.driveItem as Record<string, unknown> | undefined;
  const itemName = (driveItem?.name as string) || (target.name as string);
  if (itemName && itemName.startsWith("items/")) return itemName;
  if (typeof target.name === "string" && target.name.startsWith("items/"))
    return target.name;
  return pickTitle(target).replace(/\s+/g, "_").slice(0, 64);
}

function pickAction(activity: Record<string, unknown>): string {
  const actions = activity.actions as Array<Record<string, unknown>> | undefined;
  if (!actions?.length) return "unknown";
  const detail = actions[0].detail as Record<string, unknown> | undefined;
  if (detail?.create) return "create";
  if (detail?.edit) return "edit";
  if (detail?.move) return "move";
  if (detail?.rename) return "rename";
  if (detail?.delete) return "delete";
  if (detail?.permissionChange) return "permissionChange";
  if (detail?.comment) return "comment";
  if (detail?.dlpChange) return "dlpChange";
  return Object.keys(detail ?? {})[0] ?? "activity";
}

function pickTime(activity: Record<string, unknown>): number {
  const ts = activity.timestamp as string | undefined;
  if (ts) return new Date(ts).getTime();
  return Date.now();
}

/**
 * Maps one Activity resource to zero or more normalized events (one per Drive target).
 */
export function activityToEvents(activity: Record<string, unknown>): NormalizedActivity[] {
  const targets = (activity.targets ?? []) as Array<Record<string, unknown>>;
  const t = pickTime(activity);
  const action = pickAction(activity);
  if (!targets.length) {
    return [
      {
        t,
        action,
        fileId: "unknown",
        fileName: "unknown",
      },
    ];
  }
  return targets.map((target) => ({
    t,
    action,
    fileId: pickFileId(target),
    fileName: pickTitle(target),
  }));
}

export interface FetchProgress {
  page: number;
  totalSoFar: number;
}

/**
 * Paginates `activity:query` client-side (OAuth access token).
 */
export async function fetchAllDriveActivities(
  accessToken: string,
  onProgress?: (p: FetchProgress) => void,
  maxPages = 40
): Promise<NormalizedActivity[]> {
  const out: NormalizedActivity[] = [];
  let pageToken: string | undefined;
  let page = 0;

  while (page < maxPages) {
    const body: Record<string, unknown> = { pageSize: 100 };
    if (pageToken) body.pageToken = pageToken;

    const res = await fetch("https://driveactivity.googleapis.com/v2/activity:query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Drive Activity API ${res.status}: ${text.slice(0, 400)}`);
    }

    const data = (await res.json()) as {
      activities?: Record<string, unknown>[];
      nextPageToken?: string;
    };

    const acts = data.activities ?? [];
    for (const a of acts) {
      out.push(...activityToEvents(a as Record<string, unknown>));
    }

    page++;
    onProgress?.({ page, totalSoFar: out.length });
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }

  return out;
}
