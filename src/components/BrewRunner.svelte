<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import type { Recipe } from "../lib/types";
  import { buildTimeline, formatDuration, totalRecipeSeconds } from "../lib/timeline";
  import { enableAudio, playFinishSound, playPrepareSound, playTransitionSound } from "../lib/audio";
  import { releaseWakeLock, requestWakeLock } from "../lib/wakeLock";

  export let recipe: Recipe;

  const dispatch = createEventDispatcher<{
    cancel: void;
    complete: { startedAt: string; elapsedSeconds: number };
  }>();
  const timeline = buildTimeline(recipe);
  const totalSeconds = totalRecipeSeconds(recipe);

  let state: "ready" | "running" | "paused" = "ready";
  let elapsedSeconds = 0;
  let currentIndex = 0;
  let previousIndex = -1;
  let warnedIndex = -1;
  let intervalId: number | undefined;
  let runStartedAt = 0;
  let accumulatedMilliseconds = 0;
  let brewStartedAt = "";
  let finishing = false;
  let wakeLockActive = false;

  $: currentAction = timeline[Math.min(currentIndex, timeline.length - 1)];
  $: nextAction = timeline[currentIndex + 1];
  $: actionRemaining = Math.max(0, currentAction.endsAtSeconds - elapsedSeconds);
  $: actionProgress = Math.min(
    100,
    Math.max(0, ((elapsedSeconds - currentAction.startsAtSeconds) / currentAction.durationSeconds) * 100),
  );
  $: totalProgress = Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  function syncClock(): void {
    if (state !== "running") return;
    elapsedSeconds = (accumulatedMilliseconds + performance.now() - runStartedAt) / 1000;

    const nextIndex = timeline.findIndex((action) => elapsedSeconds < action.endsAtSeconds);
    if (nextIndex === -1) {
      void finishBrew();
      return;
    }

    currentIndex = nextIndex;
    if (previousIndex >= 0 && currentIndex !== previousIndex) {
      playTransitionSound();
    }
    previousIndex = currentIndex;

    const remaining = timeline[currentIndex].endsAtSeconds - elapsedSeconds;
    if (remaining <= 5 && remaining > 0 && warnedIndex !== currentIndex) {
      warnedIndex = currentIndex;
      playPrepareSound();
    }
  }

  async function startBrew(): Promise<void> {
    await enableAudio();
    brewStartedAt = new Date().toISOString();
    state = "running";
    runStartedAt = performance.now();
    previousIndex = 0;
    wakeLockActive = await requestWakeLock();
    intervalId = window.setInterval(syncClock, 100);
  }

  function pauseBrew(): void {
    accumulatedMilliseconds += performance.now() - runStartedAt;
    state = "paused";
    if (intervalId) window.clearInterval(intervalId);
    intervalId = undefined;
  }

  function resumeBrew(): void {
    state = "running";
    runStartedAt = performance.now();
    intervalId = window.setInterval(syncClock, 100);
    void requestWakeLock().then((active) => (wakeLockActive = active));
  }

  function seekTo(seconds: number): void {
    const target = Math.min(Math.max(0, seconds), totalSeconds - 0.01);
    accumulatedMilliseconds = target * 1000;
    elapsedSeconds = target;
    if (state === "running") runStartedAt = performance.now();
    currentIndex = Math.max(0, timeline.findIndex((action) => target < action.endsAtSeconds));
    previousIndex = currentIndex;
    warnedIndex = -1;
  }

  function previousAction(): void {
    seekTo(timeline[Math.max(0, currentIndex - 1)].startsAtSeconds);
  }

  function nextActionNow(): void {
    if (currentIndex >= timeline.length - 1) {
      void finishBrew();
      return;
    }
    seekTo(timeline[currentIndex + 1].startsAtSeconds);
    playTransitionSound();
  }

  async function finishBrew(): Promise<void> {
    if (finishing) return;
    finishing = true;
    if (intervalId) window.clearInterval(intervalId);
    intervalId = undefined;
    elapsedSeconds = Math.min(totalSeconds, elapsedSeconds);
    state = "paused";
    playFinishSound();
    await releaseWakeLock();
    dispatch("complete", {
      startedAt: brewStartedAt || new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      elapsedSeconds: Math.round(elapsedSeconds),
    });
  }

  async function cancel(): Promise<void> {
    if (intervalId) window.clearInterval(intervalId);
    await releaseWakeLock();
    dispatch("cancel");
  }

  function handleVisibilityChange(): void {
    if (document.visibilityState === "visible" && state === "running") {
      syncClock();
      void requestWakeLock().then((active) => (wakeLockActive = active));
    }
  }

  onMount(() => document.addEventListener("visibilitychange", handleVisibilityChange));
  onDestroy(() => {
    if (intervalId) window.clearInterval(intervalId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    void releaseWakeLock();
  });
</script>

<section class="brew-page" class:pour-mode={currentAction.type === "pour"}>
  <header class="brew-topbar">
    <button class="icon-button dark" on:click={cancel} aria-label="추출 취소">×</button>
    <div>
      <strong>{recipe.name}</strong>
      <span>전체 {formatDuration(totalSeconds - elapsedSeconds)} 남음</span>
    </div>
    <span class="wake-status" class:active={wakeLockActive} title="화면 켜짐 유지">
      {wakeLockActive ? "☀" : "○"}
    </span>
  </header>

  <div class="total-progress"><span style={`width: ${totalProgress}%`}></span></div>

  {#if state === "ready"}
    <div class="ready-panel">
      <span class="ready-icon">☕</span>
      <span class="eyebrow">준비됐나요?</span>
      <h1>원두 {recipe.coffeeGrams}g과<br />물 {recipe.waterGrams}g을 준비하세요</h1>
      <p>시작을 누르면 소리 알림이 활성화되고 첫 액션부터 바로 진행됩니다.</p>
      <button class="primary-button" on:click={startBrew}>추출 시작</button>
    </div>
  {:else}
    <main class="brew-content">
      <div class="step-label">STEP {currentAction.stepNumber} · {currentAction.stepTitle}</div>
      <div class="action-kind">{currentAction.type === "pour" ? "지금 부으세요" : "지금 기다리세요"}</div>
      <h1>{currentAction.title}</h1>

      <div class="timer-ring" style={`--progress: ${actionProgress * 3.6}deg`}>
        <div>
          <strong>{formatDuration(actionRemaining)}</strong>
          <span>남음</span>
        </div>
      </div>

      <div class="water-total">
        <span>누적 물량</span>
        <strong>{currentAction.cumulativeWaterGrams}<small>g</small></strong>
      </div>

      <article class="instruction">
        <span>상세 안내</span>
        <p>{currentAction.description}</p>
      </article>

      <article class="next-action">
        <span>다음 행동</span>
        {#if nextAction}
          <div><strong>{nextAction.title}</strong><em>{nextAction.durationSeconds}초</em></div>
        {:else}
          <div><strong>추출 완료</strong><em>마지막</em></div>
        {/if}
      </article>
    </main>

    <footer class="brew-controls">
      <button on:click={previousAction} aria-label="이전 행동">↶</button>
      {#if state === "running"}
        <button class="pause-button" on:click={pauseBrew} aria-label="일시정지">Ⅱ</button>
      {:else}
        <button class="pause-button" on:click={resumeBrew} aria-label="계속하기">▶</button>
      {/if}
      <button on:click={nextActionNow} aria-label="다음 행동">↷</button>
    </footer>
  {/if}
</section>
