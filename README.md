# Simple Clock(Fork / Pull Request 練習用サンプル)

GitHub の **Fork** と **Pull Request** の操作を体験するためのサンプルプロジェクトです。
HTML + CSS + JavaScript だけで作った、アナログ・デジタル表示付きの時計アプリです。

## 動かし方

ビルドやサーバーは不要です。`index.html` をブラウザで開くだけで動きます。

```
sample-clock-app/
├── index.html   … 画面の構造とカラーパレットの定義
├── style.css    … 見た目
├── script.js    … 時計の動作と色の切り替え
└── README.md    … このファイル
```

## 盤面の色のしくみ

盤面の色は **HTML を編集するだけ** で変えられます。`script.js` や `style.css` を触る必要はありません。

### 1. 最初に表示される色を変える

`index.html` の時計本体にある `data-face-color` 属性を書き換えます。
指定できるのは、カラーパレットに登録されている `data-color-name` の値です。

```html
<section class="clock" id="clock" data-face-color="mint" aria-label="時計">
```

### 2. パレットに色を追加する

`index.html` の `<div class="palette__list" id="palette">` の中に `<button>` を 1 行追加します。

```html
<button class="swatch" data-color-name="olive" data-color="#84cc16">オリーブ</button>
```

| 属性・内容        | 意味                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| `data-color-name` | 色の名前(英数字)。`data-face-color` で参照するときに使います       |
| `data-color`      | 盤面に塗る色。`#RRGGBB` のほか `rgb()` / `hsl()` / `tomato` なども可 |
| ボタンの中身      | パレットに表示されるラベル                                            |

追加したボタンは自動的にパレットに並び、クリックすると盤面がその色になります。
針や目盛りの色は、盤面の明るさに応じて自動で黒か白に切り替わります。

色見本として、下記のサイトを参考にしてください。

- [原色大辞典](https://www.colordic.org/)

### 3. 既存の色を変える

既存の `<button>` の `data-color` やラベルを書き換えるだけです。

## 練習課題の例

1. このリポジトリを **Fork** する
2. 自分の Fork にブランチを作り、`index.html` のパレットに好きな色を 1 つ追加する
3. ブラウザで `index.html` を開き、追加した色が選べることを確認する
4. 変更をコミット・プッシュして、元のリポジトリへ **Pull Request** を送る

同じファイルの同じ場所を複数人が編集するとコンフリクトが起きるので、
コンフリクトの解消を体験する教材としても使えます。
