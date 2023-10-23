# todoApp frontend

# directory
```
.
├── node_modules
└── src
    ├── assets // 画像
    ├── components // vueファイル
    │    ├── common // 共通コンポーネント
    │    ├── calendar // カレンダー系
    │    └── project // プロジェクト系
    ├── modules // 共通で使用するメソッド等のtsファイル
    ├── stores // piniaのストア定義ファイル
    ├── types // 型定義のtsファイル
    ├── App.vue
    ├── main.ts
    └── router.ts
```

# 実行方法
- dev containerで`vue`のコンテナに入る
- vscodeのターミナルで`npm run dev`を実行する