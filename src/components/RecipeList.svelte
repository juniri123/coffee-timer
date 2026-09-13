<script lang="ts">
  import type { Recipe } from "../lib/types";
  import { totalRecipeSeconds, formatDuration } from "../lib/timeline";

  export let recipes: Recipe[] = [];
  export let onSelect: (recipe: Recipe) => void;
</script>

<section class="page stack">
  <header class="hero">
    <span class="eyebrow">오늘의 커피</span>
    <h1>어떤 커피를<br />내려볼까요?</h1>
    <p>레시피를 고르면 붓기와 기다리기를 순서대로 안내합니다.</p>
  </header>

  <div class="section-heading">
    <h2>내 레시피</h2>
    <span>{recipes.length}개</span>
  </div>

  {#each recipes as recipe}
    <button class="recipe-card" on:click={() => onSelect(recipe)}>
      <span class="brewer-icon" aria-hidden="true">V60</span>
      <span class="recipe-copy">
        <strong>{recipe.name}</strong>
        <span>{recipe.coffeeGrams}g · {recipe.waterGrams}g · {formatDuration(totalRecipeSeconds(recipe))}</span>
        <small>{recipe.description}</small>
      </span>
      <span class="chevron" aria-hidden="true">›</span>
    </button>
  {/each}

  <aside class="offline-note">
    <span aria-hidden="true">✓</span>
    <div>
      <strong>오프라인 사용 가능</strong>
      <p>레시피와 추출 기록은 이 기기에 안전하게 저장됩니다.</p>
    </div>
  </aside>
</section>
