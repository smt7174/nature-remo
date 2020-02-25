# nature-remo

※2020/2/27(木)に開催された、「Serverless Meetup Tokyo #16」の発表で使用したサンプルアプリのリポジトリです。

https://serverless.connpass.com/event/165352/

## 構成

|ファイル名|説明|備考|
|:---|:---|:---|
|lammbda/createQsJson.js|JSONファイルをS3に作成するLambda関数||
|lammbda/getAllEvents.js|DynamoDBのデータを取得するLambda関数|「All」とあるけど、実際には開始年月日を指定可能|
|lammbda/getNewestEvents.js|Nature Remoから最新のセンサデータを取得し、DynamoDBに格納するLambda関数||
|crypto_sample.js|Nature Remoのアクセストークンの復号化を行い、serverless.ymlの「custom.NatureRemoAccessToken」に設定するJS関数|詳細は下記「crypto_sample.jsについて」を参照|
|serverless.yml|Serverless FrameworkでAWSへデプロイを行うためのファイル本体|「getAllEvents」のhttpイベント(API Gateway)は、発表では未使用。|
|timestamp.js|現在のタイムスタンプを取得し、serverless.ymlの「custom.timeStamp」に設定するJS関数||

## crypto_sample.jsについて

crypto_sample.jsですが、(本文にコメントを書いてますが)「encryptedText」に(Nature Remoのアクセストークンを)暗号化した値を設定すると、復号化したアクセストークンが返却され、serverless.ymlの「custom.NatureRemoAccessToken」に設定されます。(SecretsManagerに保存しています)

※「暗号化した値が分からない」場合、17～18行目のコメントを外し、「planeText」に平文のアクセストークンを設定すれば、暗号化した値が分かります。(ログで表示される)

また、実際に使用する場合、ファイル名を「crypto.js」にリネームしてから使用してください。
  
質問などあれば、Twitter([@makky12](https://twitter.com/makky12))まで。