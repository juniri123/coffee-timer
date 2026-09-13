import type { Recipe, TimelineAction } from "./types";

export function buildTimeline(recipe: Recipe): TimelineAction[] {
  let elapsed = 0;
  let cumulativeWater = 0;
  let timelineIndex = 0;

  return recipe.steps.flatMap((step, stepIndex) =>
    step.actions.map((action, actionIndex) => {
      const startsAtSeconds = elapsed;
      elapsed += action.durationSeconds;
      cumulativeWater += action.waterGrams;

      return {
        ...action,
        stepId: step.id,
        stepTitle: step.title,
        stepNumber: stepIndex + 1,
        actionNumber: actionIndex + 1,
        timelineIndex: timelineIndex++,
        startsAtSeconds,
        endsAtSeconds: elapsed,
        cumulativeWaterGrams: cumulativeWater,
      };
    }),
  );
}

export function totalRecipeSeconds(recipe: Recipe): number {
  return recipe.steps.reduce(
    (total, step) =>
      total + step.actions.reduce((stepTotal, action) => stepTotal + action.durationSeconds, 0),
    0,
  );
}

export function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}
