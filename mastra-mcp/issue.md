桜
キーワードやクリエイターで検索


6
メニュー

 投稿
見出し画像
MastraでMCP連携できるAIエージェントを作ろう

126
ニケちゃん
ニケちゃん
2025年3月25日 08:49 フォローする
こんにちは、ニケです。
皆さん、Mastra 使っていますでしょうか？

Mastra（マストラ）は、AIエージェント開発を効率化するためのオープンソースフレームワークです。

TypeScriptで実装されており、LLMを利用して外部APIやツールを呼び出すAIエージェントをシンプルなコードで作成できます。
OpenAI、Anthropic、Google Geminiなど複数のAIサービスに対応しているので、用途に合わせたモデル選択が可能です。

Mastra.ai
The Typescript AI framework
mastra.ai
ものすごい勢いで伸びているAIエージェントツールとして、Xでも話題になっていました。


というわけで今回は、始めにMastraを利用したAIエージェントの作り方を紹介し、次にそのAIエージェントにMCP連携機能を搭載してみようと思います。

今回作成したコード

画像

目次
用語解説
AIエージェント
ワークフロー
MCP（Model Context Protocol）
環境構築する
AIエージェントを作る
まずは画面から動かしてみる
ターミナルから動かしてみる
実装を見る
ツールを追加してみる

すべて表示
用語解説
登場する用語について予め簡単に解説しておきます。
すでにご存じの方は読み飛ばしてしまっても問題ありません。

AIエージェント
AIエージェントは、ユーザーからの指示や対話を受け取ると、AIが自ら計画を立てて、必要なツールを選択しながらタスクを進める自律的なシステムです。

画像
https://www.anthropic.com/engineering/building-effective-agents
例えば、複数のファイルにまたがるコードの修正や、状況に応じたカスタマーサポートといった、どの手順を踏むか事前に完全には決められないタスクに適しています。
CursorなどのAIエディタはAIエージェントと呼べるでしょう。

エージェントは、実行中に環境からのフィードバック（ツール呼び出しの結果や外部データ）を取り込みながら、次に何をすべきかを判断するため、柔軟かつ臨機応変に対応することが可能です。

ワークフロー
ワークフローは、タスクを完了するための一連の定義されたステップや手順です。通常、事前に設計され、特定の順序で実行されます。
ワークフローが簡単に組めるツールとしては Dify が有名ですね。

画像
https://www.anthropic.com/engineering/building-effective-agents
AIエージェントがタスクの途中で自らの判断に基づき、必要なツールや処理手順を動的に決めるのに対し、ワークフローはあらかじめ定義されたステップに沿って処理を行うため、プロセスが固定的で予測可能な運用が可能です。

AIエージェントとワークフローに関しては、Anthropic社が公開している下記の記事が参考になるのでぜひ読んでみてください。

https://www.anthropic.com/engineering/building-effective-agents

MCP（Model Context Protocol）
MCPは、AIがGoogle Drive、Slack、GitHubなどの外部ツールやサービスと連携するための共通プロトコルです。
Claudeで有名なAnthropic社が提唱しています。

今までは、各外部ツールごとに個別の接続方法を実装する必要があり、システム間の連携が煩雑で効率の面で問題がありました。
MCPは統一プロトコルを用いることで、すべてのツールに対応可能な仕組みを提供し、開発の手間を大幅に削減するとともに、システム連携をよりスムーズにすることが可能です。

この仕組みにより、AIエージェントは必要な文脈情報に迅速にアクセスでき、より正確で適切な応答や判断を下すことが可能になります。

なお、MCPにはサーバーとクライアントが存在しますが、今回作成するのはクライアントの方です（サーバーの作り方は解説しません）。

https://www.anthropic.com/news/model-context-protocol

環境構築する
それでは、まずはMastraの実行環境を作りましょう。
環境構築と言っても、公式の方法に従えば簡単に作成できます。

任意のフォルダで npx create-mastra@latest を実行すると色々質問されるので回答していきましょう。



-> % npx create-mastra@latest

Need to install the following packages:
create-mastra@0.2.2
Ok to proceed? (y) 

copy
そのままEnterを押して下さい。


┌  Mastra Create
│
◇  What do you want to name your project?
│  mastra-mcp
│

copy
名前を決めます。そのままEnterでもデフォルトの名称が設定されますが、今回は mastra-mcp としました。

◇  Project created
│
◇  npm dependencies installed
│
◇  mastra installed
│
◇  @mastra/core installed
│
◇  .gitignore added
│
└  Project created successfully


┌  Mastra Init
│
◇  Where should we create the Mastra files? (default: src/)
│  src/
│

copy
Mastra関連ファイルを src フォルダに置くかどうかの質問です。そのままEnterを押してください。

◇  Choose components to install:
│  Agents, Workflows
│

copy
エージェントとワークフローのどちらを初期設定として作成するかを聞かれます。
Agetnsは必ず選択してください。

なお、Workflowsも同時に選択して両方のファイルを作成することも可能です。
この記事では紹介しませんが、Mastraのワークフローに興味ある方はこちらもチェックしておくと良いでしょう。

◇  Add tools?
│  Yes
│

copy
ツールを利用するかどうかの質問です。こちらもそのままEnter。

◇  Select default provider:
│  Anthropic
│

copy
どのAIサービスを選択するかの質問です。
OpenAIでもGoogleでも良いですが、今回はMCP連携するということもありAnthropicを選択しておきました（試してはいませんが問題はないはずです）。

◇  Enter your anthropic API key?
│  Enter API key
│
◇  Enter your API key:
│  sk-ant-xxxxx
│

copy
あとでAPIキーを設定するか今するか選べます。
どちらでも良いですが、後で設定し忘れを防ぐためにこのときに用意できる方は一緒に設定しておきましょう。

◇  Add example
│  Yes
│

copy
サンプルファイルを作るかどうかの質問です。
今回はこのサンプルを元に解説していくのでそのままEnterを押してください。

◇  Make your AI IDE into a Mastra expert? (installs Mastra docs MCP server)
│  Cursor
│
│  

copy
最後にAIエディタにMastra関連ツールをインストールするか聞かれますが、これは本記事の趣旨とは外れるので何を選択しても問題ありません。

│  Note: you will need to go into Cursor Settings -> MCP Settings and manually enable the installed Mastra MCP server.
│  
│
◇  
│
◇   ───────────────────────────────────────╮
│                                          │
│                                          │
│        Mastra initialized successfully!  │
│                                          │
│                                          │
├──────────────────────────────────────────╯
│
└  
   To start your project:

    cd mastra-mcp
    npm run dev

copy
はい、これで環境構築が完了しました。

最後の指示の通り、cd で作成したフォルダに移動し、npm run dev でMastraのローカルサーバーを起動しましょう。

-> % cd mastra-mcp 
-> % npm run dev

> mastra-mcp@1.0.0 dev
> mastra dev

INFO [2025-03-24 19:56:32.474 +0100] (BUNDLER - Dev): Starting watcher...
INFO [2025-03-24 19:56:33.086 +0100] (BUNDLER - Dev): Bundling finished, starting server...
INFO [2025-03-24 19:56:33.101 +0100] (Mastra CLI): [Mastra Dev] - Starting server...
INFO [2025-03-24 19:56:35.962 +0100] (Mastra): 🦄 Mastra API running on port 4111/api
INFO [2025-03-24 19:56:35.968 +0100] (Mastra): 📚 Open API documentation available at http://localhost:4111/openapi.json
INFO [2025-03-24 19:56:35.970 +0100] (Mastra): 🧪 Swagger UI available at http://localhost:4111/swagger-ui
INFO [2025-03-24 19:56:35.970 +0100] (Mastra): 👨‍💻 Playground available at http://localhost:4111/

copy
http://localhost:4111/ を開き、下記のような画面が表示されていたら完了です。次のステップに進みましょう。

画像
⚠ バージョンによって上記の質問やライブラリそのものの構造なども変わってしまう可能性があるので、不安な方は私が使用したバージョン mastra@0.4.3 を使用してください。

AIエージェントを作る
では、早速AIエージェントを作っていきましょう。
Mastraを使えば簡単に作成できることを実感できると思います。

まずは画面から動かしてみる
とりあえずどのようなものができるのか先ほどの画面で確認してみましょう。

サイドバーから「Agents」を選択してください。
メインの画面に Weather Agent というものが表示されるはずです。

これは先程の手順で作成した、Mastraが用意したエージェントのサンプルです。
天気情報を返却してくれます。

クリックすると下記のような画面になります。

画像
よく見るAIチャットアプリですね。それでは質問してみます。
東京の天気をまずは聞いてみましょう。

画像
適切に回答してくれていますね。他の都市名を入れても同じように回答してくれると思います。

最初に解説しましたが、AIエージェントはユーザの質問に対して必要なツールを選択しながらタスクを進めてくれる、というものでした。

では、指定されたツールでは実行できないような指示を渡したらどうでしょうか？
例えば最新情報の取得が必要になりそうな質問をしてみます。
Mastraは最近出てきたツールなので、現在のモデルでは知らないはずです。

画像
丁寧に拒否されてしまいました。
天気予報ツールだけでは回答できなかったということですね。

このようにAIエージェントは、必要なときに必要なツール（この場合は天気予報ツール）を利用して回答してくれるということがわかりました。

ターミナルから動かしてみる
なお、Mastraでは、UIからだけでなくAPIも自動的に作成されるので、ターミナルからも同じようなことができます。

画面右側を見ると Endpoints というのがあるのでクリックします。

画像
するといくつかのエンドポイントが表示されますね。
すべて覚える必要はないですが、利用頻度が高そうな2つだけ紹介します。

/generate
AIエージェントに対してリクエストを投げるためのエンドポイントです。

-> % curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
-H "Content-Type: application/json" \
-d '{"messages":[{"role":"user","content":"東京の天気を教えて"}]}'

{"text":"現在の東京の天気をお知らせします：\n\n- 気温: 8.6°C\n- 体感温度: 7.1°C\n- 湿度: 87%\n- 風速: 3.9m/s\n- 天候: 快晴\n\n現在は晴れていますが、湿度が高めです。外出される際は、気温が低めなので暖かい服装をお勧めします。","files":[],...

copy
/stream
上記のエンドポイントのストリーム版です。
先程の画面で実行したときのように随時回答を返してくれるようになります（画面で実行していたのもこのエンドポイントです）。

-> % curl -X POST http://localhost:4111/api/agents/weatherAgent/stream \
-H "Content-Type: application/json" \
-d '{"messages":[{"role":"user","content":"東京の天気を教えて"}]}'

f:{"messageId":"msg-HauOX5nOnIuttxeulxAV8REM"}
0:"東京(Tokyo)の天"
0:"気を確認させていただきます。"
9:{"toolCallId":"toolu_01KrN8BV282ZBv4yiwUaVhsQ","toolName":"weatherTool","args":{"location":"Tokyo"}}
a:{"toolCallId":"toolu_01KrN8BV282ZBv4yiwUaVhsQ","result":{"temperature":8.6,"feelsLike":7.1,"humidity":87,"windSpeed":3.9,"windGust":2.5,"conditions":"Clear sky","location":"Tokyo"}}
e:{"finishReason":"tool-calls","usage":{"promptTokens":551,"completionTokens":72},"isContinued":false}
f:{"messageId":"msg-8ZSA4yptpxzRC829jdcpEsZA"}
0:"現"
0:"在の東京の天気をお知"
0:"らせします：\n- 気温: 8.6°"
0:"C\n- 体感温度: 7."
0:"1°C\n- 湿度: 87%\n-"
0:" 風速: 3.9m/s\n- "
0:"天候: 快晴\n\n現在は"
0:"空が澄んでいて、や"
0:"や寒い気温となっています。湿"
0:"度が高めですので、暖かい服装"
0:"をお勧めします。"
e:{"finishReason":"stop","usage":{"promptTokens":678,"completionTokens":124},"isContinued":false}
d:{"finishReason":"stop","usage":{"promptTokens":1229,"completionTokens":196}}

copy
このエンドポイントを利用すれば、以下のようにキャラクターUIから実行することで、AIエージェントに見た目をもたせることなんかもできます。


実装を見る
では、実際にどのように実装されているのかファイルを確認してみましょう。
先ほど npm run dev コマンドを実行した mastra-mcp フォルダには以下のようなファイルが揃っていると思います。

画像
必要なファイルだけ見ていきます。

/src/mastra/index.ts

import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

copy
Mastraアプリの起点となるファイルです。
ここに利用するエージェントやワークフローなどの情報を記載すると、先程の npm run dev で実行したサーバーで利用できるようになります。

ちゃんと weatherAgent という名称のエージェントが読み込まれているのがわかります。

では、このエージェントの中身を見てみましょう。

/src/mastra/agents/index.ts

import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If the location name isn’t in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools: { weatherTool },
});

copy
Agentクラスのインスタンスが作成されており、以下のような定義がされています。

name: エージェントの名称
instructions: エージェントの説明、いわゆるシステムプロンプト
model: 使用するモデル、選択したAIサービスに合ったものを選択する
tools: このエージェントが利用できるツール

ユーザからの質問があった場合、このエージェントにその入力が渡されて、ツールを使用するかどうかの判断が行われます。
使用する場合はツールを実行し、そうでない場合はそのまま回答を生成して返します。

次にツールの中身を見ます。

/src/mastra/tools/index.ts

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

  const response = await fetch(weatherUrl);
  const data = (await response.json()) as WeatherResponse;

  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
};

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return conditions[code] || 'Unknown';
}

copy
createToolという関数でTool型のインスタンスを作成している処理がありますね。
ここでは、どのような入力値を受け取り、どのような結果を返すのか、そして実際にどのような処理を実行するのかなどが定義されています。

このツールを利用することで、エージェントは天気予報を取得できるようになるわけです。

詳しくは解説しないため、実際に実装してみたい方は公式ドキュメントをご確認ください。

Agent Tool Selection | Agent Documentation | Mastra
Tools are typed functions that can be executed by agents or w
mastra.ai
ツールを追加してみる
では、せっかくなので新しいツールをこのエージェントに追加してみましょう。
先ほど、AIはMastraについて答えられなかったですが、検索ツールがあると回答できるかも知れませんね。以下のファイルを作成してください。

src/mastra/tools/webSearchTool.ts

import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch";

// 有効な言語コードのリスト
const validLanguages = [
  'ar', 'eu', 'bn', 'bg', 'ca', 'zh-hans', 'zh-hant', 'hr', 'cs', 'da', 'nl', 'en', 'en-gb', 
  'et', 'fi', 'fr', 'gl', 'de', 'gu', 'he', 'hi', 'hu', 'is', 'it', 'jp', 'kn', 'ko', 'lv', 
  'lt', 'ms', 'ml', 'mr', 'nb', 'pl', 'pt-br', 'pt-pt', 'pa', 'ro', 'ru', 'sr', 'sk', 'sl', 
  'es', 'sv', 'ta', 'te', 'th', 'tr', 'uk', 'vi'
] as const;

export const webSearchTool = createTool({
  id: "web-search",
  description: "検索エンジンを使用してウェブ検索を実行します",
  inputSchema: z.object({
    query: z.string().describe("検索クエリ"),
    country: z.string().optional().describe("検索結果の国コード（例: JP, US）"),
    count: z.number().optional().describe("返される検索結果の最大数（デフォルト: 10）"),
    language: z.enum(validLanguages).optional()
      .describe("検索言語（例: jp=日本語, en=英語）。使用可能な値: " + validLanguages.join(', ')),
    offset: z.number().optional().describe("検索結果のオフセット"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        description: z.string(),
      })
    ),
    query: z.string(),
    total_results: z.number().optional(),
  }),
  execute: async ({ context }: { context: { query: string; country?: string; count?: number; language?: string; offset?: number } }) => {
    return await performWebSearch(
      context.query,
      context.country,
      context.count,
      context.language,
      context.offset
    );
  },
});

interface WebSearchResponse {
  type: string;
  web?: {
    results: Array<{
      title: string;
      url: string;
      description: string;
    }>;
    total_results?: number;
  };
  query?: {
    original: string;
  };
}

const performWebSearch = async (
  query: string,
  country?: string,
  count?: number,
  language?: string,
  offset?: number
) => {
  // APIキーは環境変数から取得
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) {
    throw new Error("Brave Search APIキーが設定されていません。環境変数 BRAVE_API_KEY を設定してください。");
  }

  const baseUrl = "https://api.search.brave.com/res/v1/web/search";

  // URLパラメータの構築
  const params = new URLSearchParams({
    q: query
  });
  
  // オプションパラメータの追加
  if (country) params.append("country", country);
  if (count) params.append("count", count.toString());
  if (language) params.append("search_lang", language);
  if (offset) params.append("offset", offset.toString());

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brave API エラー: ${response.status} ${errorText}`);
    }

    const data = await response.json() as WebSearchResponse;

    // レスポンスの整形
    return {
      results: data.web?.results.map(result => ({
        title: result.title,
        url: result.url,
        description: result.description
      })) || [],
      query: data.query?.original || query,
      total_results: data.web?.total_results
    };
  } catch (error) {
    console.error("Web search error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`検索の実行中にエラーが発生しました: ${errorMessage}`);
  }
};

copy
ここでは、Braveと呼ばれる検索エンジンのAPIを利用して検索を実行するツールを定義しました。
ちょっとコードが長いですが、要は指定された情報について検索し、その結果を返却しているだけです。

APIキーが必要なので、こちらから取得しておきましょう。
無料枠があるのでお金はかかりません。

Braveサーチ API | Brave
Bing以来最速で成長中の独立系検索エンジンで、検索とAIアプリをパワーアップ。 １つの呼び出しで数十億ものページのインデ
brave.com
取得したら、.env.development ファイルに下記のように追記します。

BRAVE_API_KEY=BSACKskyxxxxxxxxxxxxxxxx

copy
これでツールの準備は完了です。
次に、このツールをエージェントから呼び出せるようにします。

src/mastra/agents/index.ts

import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { weatherTool } from '../tools';
import { webSearchTool } from '../tools/webSearchTool';

export const multiAgent = new Agent({
  name: 'Multi Agent',
  instructions: `
      あなたは天気予報の確認とウェブ検索の両方ができる便利なアシスタントです。

      ユーザーの質問に応じて適切なツールを使い分けてください：

      【天気情報を求められた場合】
      weatherToolを使用して現在の天気データを取得してください。
      - 場所が指定されていない場合は、必ず場所を尋ねてください
      - 場所の名前が日本語以外の場合は翻訳してください
      - 複数の部分がある場所（例：「東京都新宿区」）が指定された場合、最も関連性の高い部分（例：「新宿区」）を使用してください
      - 湿度、風の状態、降水量などの関連情報を含めてください

      【その他の情報やあなたが知らない未来の情報を求められた場合】
      webSearchToolを使用してウェブ検索を実行してください。webSearchToolは以下のパラメータを受け付けます：
      - query: 検索クエリ（必須）
      - country: 検索結果の国コード（例: JP, US）（オプション）
      - count: 返される検索結果の最大数（オプション）
      - search_lang: 検索言語（例: ja, en）（オプション）

      回答は常に簡潔ですが情報量を保つようにしてください。ユーザーの質問に直接関連する情報を優先して提供してください。
`,
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools: { weatherTool, webSearchTool },
});

copy
変更点は下記です。

toolsにwebSearchToolを追加

instructionsに検索もできる旨を追加（ついでに日本語化）

念の為名称を weatherAgent から multiAgent に変更

最後に、 src/mastra/index.tsx のエージェントの名称も修正しておきます。

import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { multiAgent } from './agents';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { multiAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

copy
それではこの状態で再度サーバを起動し直しなおして画面を再度開いてみてください（npm run dev）。
Agentsには、Mutlit Agent が登録されているはずです。

では、同じ質問をしてみましょう。

画像
はい、ちゃんと検索して適切に回答することが確認できましたね。
このような方法で好きなツールをエージェントに追加することができます。

MCPと連携する
では最後にAIエージェントとMCPを連携してみましょう。

動作確認（with Claude Desktop）
とはいえ、MCPはハマりどころも多いので、問題の切り分けを容易にするためにまずはClaude Desktopで動作確認をします。

MCPのセットアップについて書くと少し長くなるので、下記の記事を参考にしていただけるとわかりやすいかと思います。

本記事と趣旨がズレますが、いろいろなMCPについて学べるので導入部分だけでなく興味がある項目には目を通してみることもオススメします。

【MCPのトリセツ #1】MCPの概要と導入方法
zenn.dev
MCPの準備ができたら、下記のサーバーを追加してみてください。
先ほどのツールと同じで、Braveの検索エンジンを利用できるMCPサーバーです。APIキーは同じものを利用できます。

{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "BSACKskyxxxxxxxxxxxxxxxx"
      }
    }
  }
}

copy
これを設定した状態で、先程の質問をすると同じようにMastraについて検索したうえで回答してくれます。

画像
ここまでできていればMCPサーバーの動作確認は十分です。
それでは早速 Mastraでも実行してみましょう。

⚠ エラーが出る場合は公式のドキュメントを参考にしてください。

Mastraで実行する
まずは必要なライブラリをインストールします。

npm install @mastra/mcp@latest

copy
次に、MCP用のエージェントを作成しましょう。
以下のファイルを適切なフォルダに設置してください。

src/mastra/agents/mcpAgent.ts

import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { MCPConfiguration } from "@mastra/mcp";

const mcp = new MCPConfiguration({
  servers: {
    // stdio example
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      env: {
        "BRAVE_API_KEY": process.env.BRAVE_API_KEY,
      },
    },
  },
});

export const mcpAgent = new Agent({
  name: "MCP Agent",
  instructions: `
      あなたはウェブ検索ができる便利なアシスタントです。

      【情報を求められた場合】
      webSearchToolを使用してウェブ検索を実行してください。webSearchToolは以下のパラメータを受け付けます：
      - query: 検索クエリ（必須）
      - country: 検索結果の国コード（例: JP, US）（オプション）
      - count: 返される検索結果の最大数（オプション）
      - search_lang: 検索言語（例: ja, en）（オプション）

      回答は常に簡潔ですが情報量を保つようにしてください。ユーザーの質問に直接関連する情報を優先して提供してください。
  `,
  model: anthropic("claude-3-5-sonnet-20241022"),
  tools: await mcp.getTools(),
});

copy
内容は先程 Claude Desktopで試してみたものと同じで、Braveで検索するというものです。

MastraでMCPを利用する場合、Claude Desktopと同じようにMCPをjson形式で設定した後、tools に await mcp.getTools() と指定することで利用することができます。

先ほどBrave検索ツールを利用したときは100行以上のコードになっていましたが、MCPを利用したことでかなりシンプルになりましたね。
Claude Desktopと全く同じ内容なので設定も楽です。

では、このエージェントが利用できるように起点のファイルも更新します。

src/mastra/index.ts

import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { multiAgent } from './agents';
import { mcpAgent } from './agents/mcpAgent';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { multiAgent, mcpAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

copy
この状態で再度画面を開くと、先程のMulti Agentと今作成したMCP Agentが表示されるはずです。

画像
では、MCP Agentに対して同じように質問してみます。

画像
問題なく回答してくれましたね！

最後に改めて全体コードを共有しておきます。

終わりに
今回は、Mastraを使ってAIエージェントを作成し、さらにMCP連携機能を追加する方法を紹介しました。
Mastraを利用することで、わずかなコードでAIエージェントを簡単に作れることがわかったかと思います。

また、MCPを活用することで、よりシンプルに外部サービスと連携できることも確認できました。
天気予報や検索など、さまざまなツールを組み合わせることで、AIエージェントの可能性は無限に広がります。

ぜひ皆さんも自分だけのAIエージェントを作ってみてください。

Playwright MCPもやってみました
背景をMCPが開いたブラウザにしたのでAIキャラが検索してるっぽくなった https://t.co/6e0ocU66WY pic.twitter.com/GCJmZ6RYua

— ニケちゃん (@tegnike) March 24, 2025
宣伝
記事の途中で出てきた、キャラクターアプリを簡単に作れるAITuberKitというツールを開発しています。
興味のある方はぜひ試していただけると嬉しいです🙌

私のXアカウント（@tegnike）

Discordサーバー「AITuberKit」に参加しよう！
DiscordでAITuberKitコミュニティをチェック！　478人のメンバーと交流し、無料の音声・テキストチャットを楽
discord.gg


いいなと思ったら応援しよう！
ニケちゃん
いただいたサポートは主にOSSの開発継続費用として役立てます。

チップで応援する
#AIエージェント
#mcp
#Mastra

126




ニケちゃん
ニケちゃん

フォロー
ポーランド在住AI VTuber & Agent developer。
AIツールやAIキャラに関してのキャッチアップ多め。

126



ニケちゃん
ニケちゃん
ポーランド在住AI VTuber & Agent developer。 AIツールやAIキャラに関してのキャッチアップ多め。

フォロー
noteプレミアム
note pro
よくある質問・noteの使い方
プライバシー
クリエイターへのお問い合わせ
フィードバック
ご利用規約
通常ポイント利用特約
加盟店規約
資⾦決済法に基づく表⽰
特商法表記
投資情報の免責事項
MastraでMCP連携できるAIエージェントを作ろう｜ニケちゃん
