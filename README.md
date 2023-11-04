# todoApp frontend

# directory
```
.
├── node_modules
└── src
│   ├── assets // 画像
│   ├── components // vueファイル
│   │    ├── common // 共通コンポーネント
│   │    ├── calendar // カレンダー系
│   │    └── project // プロジェクト系
│   ├── modules // 共通で使用するメソッド等のtsファイル
│   ├── stores // piniaのストア定義ファイル
│   ├── types // 型定義のtsファイル
│   ├── App.vue
│   ├── main.ts
│   └── router.ts
├── .env
├── .env.development
├── .env.production
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

# 実行方法
- dev containerで`vue`のコンテナに入る
## 開発環境
- vscodeのターミナルで`npm run dev`を実行する


# 設定ファイル
### .env
```txt:.env
VITE_CLIENT_ID="xxxxxxxx" // ここにGCPで発行したClient IDを記入する。
```
### .env.development
```
VITE_CLIENT_ID="xxxxxxxx" // ここにGCPで発行したClient IDを記入する。
VITE_REDIRECT_URI="http://localhost:5173/app"
```
### .env.production
```
VITE_CLIENT_ID="xxxxxxxx" // ここにGCPで発行したClient IDを記入する。
VITE_REDIRECT_URI="http://localhost:4173/app"
```