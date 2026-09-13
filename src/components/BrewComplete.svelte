<script lang="ts">
  import type { BrewLog } from "../lib/types";
  import { formatDuration } from "../lib/timeline";

  export let log: BrewLog;
  export let onSave: (notes: string, rating?: number) => void;

  let notes = "";
  let rating: number | undefined;
</script>

<section class="page complete-page">
  <div class="complete-mark">✓</div>
  <span class="eyebrow">추출 완료</span>
  <h1>맛있는 커피가<br />완성됐어요</h1>
  <p>{log.recipeName}</p>

  <div class="complete-stats">
    <div><span>추출 시간</span><strong>{formatDuration(log.elapsedSeconds)}</strong></div>
    <div><span>원두</span><strong>{log.coffeeGrams}g</strong></div>
    <div><span>물</span><strong>{log.waterGrams}g</strong></div>
  </div>

  <div class="rating-field">
    <span>오늘 커피는 어땠나요?</span>
    <div>
      {#each [1, 2, 3, 4, 5] as value}
        <button class:chosen={rating === value} on:click={() => (rating = value)} aria-label={`${value}점`}>★</button>
      {/each}
    </div>
  </div>

  <label class="notes-field">
    <span>메모</span>
    <textarea bind:value={notes} rows="4" placeholder="맛, 향, 다음에 바꿀 점을 남겨보세요."></textarea>
  </label>

  <button class="primary-button" on:click={() => onSave(notes.trim(), rating)}>로그 저장</button>
</section>
