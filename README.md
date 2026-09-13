# 커피 타이머

Svelte + TypeScript로 만든 모바일 우선 커피 레시피/추출 로그 PWA입니다.

현재 MVP에서는 V60 데모 레시피를 선택해 붓기와 기다리기 액션을 끝까지 안내받고,
완료한 추출을 기기의 IndexedDB에 기록할 수 있습니다.

## 실행

```bash
npm ci
npm run dev
```

프로덕션 빌드:

```bash
npm run build
npm run preview
```

## 저장과 오프라인

- 앱 파일은 GitHub Pages에서 정적으로 제공됩니다.
- 서비스 워커가 앱 파일을 저장하므로 한 번 방문하거나 설치한 뒤에는 오프라인에서도 실행됩니다.
- 레시피는 IndexedDB의 `recipes`, 추출 기록은 `brewLogs` 저장소에 보관됩니다.
- 각 데이터에는 `updatedAt`과 `syncState`가 있어 향후 집 서버와 동기화할 수 있습니다.
- 현재 버전은 서버 통신 없이 완전히 로컬에서 동작합니다.

## 데이터 구조

레시피는 여러 스텝을 가지며, 각 스텝은 여러 액션을 가집니다. 액션은 `pour` 또는
`wait` 타입이고 시간, 추가 물량, 상세 설명을 가집니다. 예를 들어 30초 블룸은
10초 동안 50g 붓기와 20초 기다리기 두 액션으로 표현됩니다.

## 배포

`main` 브랜치에 푸시하면 기존 GitHub Actions 워크플로가 `dist`를 GitHub Pages에
배포합니다. Vite base 경로는 `/coffee-timer/`로 유지됩니다.
