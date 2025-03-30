# sample-mastra

Mastraフレームワークを使用したAIエージェントの実装サンプルプロジェクトです。

## 必要要件

- Node.js
- npm

## 使用パッケージ

- mastra: ^0.4.4
- @mastra/core: ^0.7.0
- @ai-sdk/openai: ^1.3.4
- zod: ^3.24.2

## セットアップ

1. 依存パッケージのインストール:
```bash
npm install
```

2. 環境変数の設定:
`.env.development`ファイルを作成し、必要なAPIキーを設定してください。

## 実行方法

開発サーバーの起動:
```bash
npm run dev
```

サーバーが起動したら、以下のURLでアクセスできます：
- Playground: http://localhost:4111/
- API Documentation: http://localhost:4111/openapi.json
- Swagger UI: http://localhost:4111/swagger-ui

## プロジェクト構成

```
.
├── src/
│   └── mastra/
│       ├── agents/      # AIエージェントの定義
│       ├── tools/       # ツールの実装
│       └── index.ts     # メインエントリーポイント
├── package.json
└── tsconfig.json
```
