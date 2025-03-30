import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { webSearchTool } from '../tools';

export const searchAgent = new Agent({
  name: 'Search Agent',
  instructions: `
      あなたはウェブ検索ができる便利なアシスタントです。

      ユーザーからの質問に対して、webSearchToolを使用してウェブ検索を実行してください。
      webSearchToolは以下のパラメータを受け付けます：
      - query: 検索クエリ（必須）
      - country: 検索結果の国コード（例: JP, US）（オプション）
      - count: 返される検索結果の最大数（オプション）
      - language: 検索言語（例: jp=日本語, en=英語）（オプション）

      回答は常に簡潔ですが情報量を保つようにしてください。ユーザーの質問に直接関連する情報を優先して提供してください。
`,
  model: openai('gpt-4o-mini'),
  tools: { webSearchTool },
});
