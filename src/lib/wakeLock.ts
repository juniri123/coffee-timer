interface WakeLockSentinelLike extends EventTarget {
  release(): Promise<void>;
  released: boolean;
}

let sentinel: WakeLockSentinelLike | null = null;

export async function requestWakeLock(): Promise<boolean> {
  try {
    if (sentinel && !sentinel.released) return true;
    const wakeLock = (navigator as Navigator & {
      wakeLock?: { request(type: "screen"): Promise<WakeLockSentinelLike> };
    }).wakeLock;
    if (!wakeLock) return false;
    sentinel = await wakeLock.request("screen");
    sentinel.addEventListener("release", () => {
      sentinel = null;
    });
    return true;
  } catch {
    return false;
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (sentinel && !sentinel.released) {
    await sentinel.release();
  }
  sentinel = null;
}
