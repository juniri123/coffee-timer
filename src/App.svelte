<script lang="ts">
  import { onMount } from "svelte";
  import BrewComplete from "./components/BrewComplete.svelte";
  import BrewLogs from "./components/BrewLogs.svelte";
  import BrewRunner from "./components/BrewRunner.svelte";
  import RecipeDetail from "./components/RecipeDetail.svelte";
  import RecipeList from "./components/RecipeList.svelte";
  import { brewLogStore, recipeStore } from "./lib/db";
  import { v60DemoRecipe } from "./lib/demoRecipe";
  import type { BrewLog, Recipe } from "./lib/types";

  type View = "recipes" | "detail" | "brew" | "complete" | "logs";

  let view: View = "recipes";
  let recipes: Recipe[] = [];
  let logs: BrewLog[] = [];
  let selectedRecipe: Recipe | null = null;
  let pendingLog: BrewLog | null = null;
  let loading = true;
  let storageError = "";

  onMount(async () => {
    try {
      await recipeStore.seed(v60DemoRecipe);
      [recipes, logs] = await Promise.all([recipeStore.list(), brewLogStore.list()]);
      selectedRecipe = recipes[0] ?? null;
    } catch (error) {
      recipes = [v60DemoRecipe];
      selectedRecipe = v60DemoRecipe;
      storageError = "로컬 저장소를 열 수 없어 이번 실행의 기록은 저장되지 않을 수 있습니다.";
      console.error(error);
    } finally {
      loading = false;
    }
  });

  function selectRecipe(recipe: Recipe): void {
    selectedRecipe = recipe;
    view = "detail";
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showRecipes(): void {
    view = "recipes";
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showLogs(): void {
    view = "logs";
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function createLog(event: CustomEvent<{ startedAt: string; elapsedSeconds: number }>): void {
    if (!selectedRecipe) return;
    const now = new Date().toISOString();
    pendingLog = {
      id: crypto.randomUUID?.() ?? `brew-${Date.now()}`,
      recipeId: selectedRecipe.id,
      recipeName: selectedRecipe.name,
      startedAt: event.detail.startedAt,
      completedAt: now,
      elapsedSeconds: event.detail.elapsedSeconds,
      coffeeGrams: selectedRecipe.coffeeGrams,
      waterGrams: selectedRecipe.waterGrams,
      notes: "",
      updatedAt: now,
      syncState: "local",
    };
    view = "complete";
  }

  async function saveLog(notes: string, rating?: number): Promise<void> {
    if (!pendingLog) return;
    const savedLog: BrewLog = { ...pendingLog, notes, rating, updatedAt: new Date().toISOString() };
    try {
      await brewLogStore.save(savedLog);
      logs = await brewLogStore.list();
    } catch (error) {
      logs = [savedLog, ...logs];
      storageError = "기록을 영구 저장하지 못했습니다.";
      console.error(error);
    }
    pendingLog = null;
    view = "logs";
  }
</script>

<svelte:head>
  <meta name="theme-color" content="#f6f1e8" />
  <meta name="description" content="오프라인에서도 사용할 수 있는 커피 레시피 타이머와 추출 로그" />
</svelte:head>

<div class="app-shell" class:immersive={view === "brew"}>
  {#if storageError}
    <button class="storage-warning" on:click={() => (storageError = "")}>{storageError} <span>×</span></button>
  {/if}

  {#if loading}
    <div class="loading-screen"><span>☕</span><p>레시피를 준비하고 있어요</p></div>
  {:else if view === "recipes"}
    <RecipeList {recipes} onSelect={selectRecipe} />
  {:else if view === "detail" && selectedRecipe}
    <RecipeDetail recipe={selectedRecipe} onBack={showRecipes} onStart={() => (view = "brew")} />
  {:else if view === "brew" && selectedRecipe}
    <BrewRunner recipe={selectedRecipe} on:cancel={() => (view = "detail")} on:complete={createLog} />
  {:else if view === "complete" && pendingLog}
    <BrewComplete log={pendingLog} onSave={saveLog} />
  {:else if view === "logs"}
    <BrewLogs {logs} />
  {/if}

  {#if view === "recipes" || view === "logs"}
    <nav class="bottom-nav" aria-label="주 메뉴">
      <button class:active={view === "recipes"} on:click={showRecipes}>
        <span>⌂</span>레시피
      </button>
      <button class:active={view === "logs"} on:click={showLogs}>
        <span>◷</span>추출 기록
      </button>
    </nav>
  {/if}
</div>
