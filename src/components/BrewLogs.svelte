<script lang="ts">
  import type { BrewLog } from "../lib/types";
  import { formatDuration } from "../lib/timeline";

  export let logs: BrewLog[] = [];

  const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
</script>

<section class="page stack">
  <header class="hero compact">
    <span class="eyebrow">나의 기록</span>
    <h1>추출 로그</h1>
    <p>이 기기에 저장된 커피 기록입니다.</p>
  </header>

  {#if logs.length === 0}
    <div class="empty-state">
      <span>☕</span>
      <strong>아직 기록이 없어요</strong>
      <p>첫 커피를 추출하면 여기에 기록됩니다.</p>
    </div>
  {:else}
    <div class="log-list">
      {#each logs as log}
        <article class="log-card">
          <div>
            <span>{dateFormatter.format(new Date(log.completedAt))}</span>
            <strong>{log.recipeName}</strong>
          </div>
          <div class="log-meta">
            <span>{formatDuration(log.elapsedSeconds)}</span>
            <span>{log.waterGrams}g</span>
            {#if log.rating}<span class="stars">{"★".repeat(log.rating)}</span>{/if}
          </div>
          {#if log.notes}<p>{log.notes}</p>{/if}
          <small>{log.syncState === "synced" ? "동기화됨" : "이 기기에 저장됨"}</small>
        </article>
      {/each}
    </div>
  {/if}
</section>
