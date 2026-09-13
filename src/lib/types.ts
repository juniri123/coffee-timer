export type BrewActionType = "pour" | "wait";

export interface BrewAction {
  id: string;
  type: BrewActionType;
  title: string;
  durationSeconds: number;
  waterGrams: number;
  description: string;
}

export interface RecipeStep {
  id: string;
  title: string;
  actions: BrewAction[];
}

export interface Recipe {
  id: string;
  name: string;
  brewer: string;
  coffeeGrams: number;
  waterGrams: number;
  waterTemperatureCelsius: number;
  grind: string;
  description: string;
  steps: RecipeStep[];
  createdAt: string;
  updatedAt: string;
  syncState: "local" | "synced" | "changed";
}

export interface BrewLog {
  id: string;
  recipeId: string;
  recipeName: string;
  startedAt: string;
  completedAt: string;
  elapsedSeconds: number;
  coffeeGrams: number;
  waterGrams: number;
  notes: string;
  rating?: number;
  updatedAt: string;
  syncState: "local" | "synced" | "changed";
}

export interface TimelineAction extends BrewAction {
  stepId: string;
  stepTitle: string;
  stepNumber: number;
  actionNumber: number;
  timelineIndex: number;
  startsAtSeconds: number;
  endsAtSeconds: number;
  cumulativeWaterGrams: number;
}
