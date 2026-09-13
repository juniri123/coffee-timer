import type { Recipe } from "./types";

const createdAt = "2026-01-16T00:00:00.000Z";

export const v60DemoRecipe: Recipe = {
  id: "v60-demo-20g",
  name: "V60 데일리 20g",
  brewer: "Hario V60",
  coffeeGrams: 20,
  waterGrams: 300,
  waterTemperatureCelsius: 93,
  grind: "중간보다 조금 가늘게",
  description:
    "블룸 후 두 번 나누어 붓는 기본 데모 레시피입니다. 각 스텝 안에서 붓기와 기다리기가 별도 액션으로 이어집니다.",
  createdAt,
  updatedAt: createdAt,
  syncState: "local",
  steps: [
    {
      id: "bloom",
      title: "블룸",
      actions: [
        {
          id: "bloom-pour",
          type: "pour",
          title: "50g까지 붓기",
          durationSeconds: 10,
          waterGrams: 50,
          description:
            "가운데에서 시작해 작은 원을 그리며 전체 커피가 젖도록 천천히 부어주세요. 마른 부분이 보이면 그쪽을 가볍게 적십니다.",
        },
        {
          id: "bloom-wait",
          type: "wait",
          title: "블룸 기다리기",
          durationSeconds: 20,
          waterGrams: 0,
          description:
            "서버를 가볍게 한 번 흔들어 커피층을 고르게 만든 뒤 기다립니다. 가스가 빠지며 표면이 잦아드는 것을 확인하세요.",
        },
      ],
    },
    {
      id: "first-pour",
      title: "1차 추출",
      actions: [
        {
          id: "first-pour-action",
          type: "pour",
          title: "180g까지 붓기",
          durationSeconds: 30,
          waterGrams: 130,
          description:
            "중앙에서 바깥쪽으로 원을 넓혔다가 다시 안쪽으로 들어옵니다. 필터 벽에 직접 물을 붓지 말고 수위를 일정하게 올려주세요.",
        },
        {
          id: "first-wait",
          type: "wait",
          title: "수위 내려가기 기다리기",
          durationSeconds: 25,
          waterGrams: 0,
          description:
            "물줄기를 멈추고 커피층 위 수위가 절반가량 내려갈 때까지 기다립니다. 완전히 드러나게 두지는 않습니다.",
        },
      ],
    },
    {
      id: "second-pour",
      title: "2차 추출",
      actions: [
        {
          id: "second-pour-action",
          type: "pour",
          title: "300g까지 붓기",
          durationSeconds: 30,
          waterGrams: 120,
          description:
            "앞선 수위를 유지한다는 느낌으로 부드럽게 부어 최종 300g에 맞춥니다. 마지막에는 서버를 가볍게 돌려 커피층을 평평하게 합니다.",
        },
        {
          id: "drawdown",
          type: "wait",
          title: "드로다운 기다리기",
          durationSeconds: 65,
          waterGrams: 0,
          description:
            "물이 빠질 때까지 기다립니다. 목표 시간은 전체 약 3분입니다. 추출이 끝나면 드리퍼를 제거하고 서버를 잘 흔들어 농도를 섞어주세요.",
        },
      ],
    },
  ],
};
