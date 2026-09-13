<script lang="ts">
  import type { Recipe } from "../lib/types";
  import { formatDuration, totalRecipeSeconds } from "../lib/timeline";

  export let recipe: Recipe;
  export let onBack: () => void;
  export let onStart: () => void;
</script>

<section class="page detail-page">
  <header class="topbar">
    <button class="icon-button" on:click={onBack} aria-label="뒤로 가기">←</button>
    <span>레시피</span>
    <span class="topbar-spacer"></span>
  </header>

  <div class="detail-hero">
    <span class="eyebrow">{recipe.brewer}</span>
    <h1>{recipe.name}</h1>
    <p>{recipe.description}</p>
  </div>

  <div class="recipe-specs" aria-label="레시피 정보">
    <div><span>원두</span><strong>{recipe.coffeeGrams}g</strong></div>
    <div><span>물</span><strong>{recipe.waterGrams}g</strong></div>
    <div><span>온도</span><strong>{recipe.waterTemperatureCelsius}℃</strong></div>
    <div><span>예상</span><strong>{formatDuration(totalRecipeSeconds(recipe))}</strong></div>
  </div>

  <div class="grind-note"><span>분쇄도</span><strong>{recipe.grind}</strong></div>

  <div class="section-heading">
    <h2>추출 순서</h2>
    <span>{recipe.steps.length}단계</span>
  </div>

  <div class="steps">
    {#each recipe.steps as step, stepIndex}
      <article class="step-card">
        <div class="step-number">{stepIndex + 1}</div>
        <div class="step-content">
          <h3>{step.title}</h3>
          {#each step.actions as action}
            <div class:pour={action.type === "pour"} class="action-row">
              <span class="action-symbol">{action.type === "pour" ? "↓" : "Ⅱ"}</span>
              <div>
                <strong>{action.title}</strong>
                <span>{action.durationSeconds}초{action.waterGrams ? ` · +${action.waterGrams}g` : ""}</span>
                <p>{action.description}</p>
              </div>
            </div>
          {/each}
        </div>
      </article>
    {/each}
  </div>

  <div class="sticky-action">
    <button class="primary-button" on:click={onStart}>추출 준비하기</button>
  </div>
</section>
