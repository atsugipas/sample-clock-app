/* =========================================================
   Simple Clock - 動作
   1. 時計の針とデジタル表示を 1 秒ごとに更新する
   2. HTML のカラーパレット(.swatch)から盤面の色を切り替える

   色の追加・変更は index.html だけで完結するように作っています。
   このファイルを編集しなくても色は増やせます。
   ========================================================= */

const clock = document.getElementById("clock");
const handHour = document.getElementById("hand-hour");
const handMinute = document.getElementById("hand-minute");
const handSecond = document.getElementById("hand-second");
const digitalTime = document.getElementById("digital-time");
const digitalDate = document.getElementById("digital-date");
const palette = document.getElementById("palette");

/* ---------- 1. 時計 ---------- */

// 盤面の目盛りを 12 個つくる(3, 6, 9, 12 の位置は太くする)
function createTicks() {
  const container = clock.querySelector(".clock__ticks");
  for (let i = 0; i < 12; i++) {
    const tick = document.createElement("span");
    tick.className = i % 3 === 0 ? "tick tick--major" : "tick";
    tick.style.transform = `rotate(${i * 30}deg)`;
    container.appendChild(tick);
  }
}

// 2 桁のゼロ埋め(9 -> "09")
function pad(value) {
  return String(value).padStart(2, "0");
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 針の角度(1 時間 = 30 度、1 分 = 6 度、1 秒 = 6 度)
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const secondDeg = seconds * 6;

  handHour.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  handMinute.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
  handSecond.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;

  digitalTime.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  digitalTime.dateTime = now.toISOString();
  digitalDate.textContent =
    `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
}

/* ---------- 2. カラーパレット ---------- */

// HTML に並んだ色見本ボタンを配列で取得する
function getSwatches() {
  return Array.from(palette.querySelectorAll(".swatch[data-color-name][data-color]"));
}

// 色名(data-color-name)から色見本ボタンを探す
function findSwatch(name) {
  return getSwatches().find((swatch) => swatch.dataset.colorName === name);
}

// CSS の色文字列を { r, g, b } に変換する
// (#RRGGBB だけでなく "tomato" や "hsl(...)" も扱えるようにブラウザに解釈させる)
function parseColor(cssColor) {
  const probe = document.createElement("span");
  probe.style.color = cssColor;
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color; // 例: "rgb(56, 189, 248)"
  probe.remove();

  const match = computed.match(/\d+(\.\d+)?/g);
  if (!match) return { r: 0, g: 0, b: 0 };
  const [r, g, b] = match.map(Number);
  return { r, g, b };
}

// 盤面が明るい色なら針を暗い色に、暗い色なら針を明るい色にする
function pickInkColor(cssColor) {
  const { r, g, b } = parseColor(cssColor);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#0f172a" : "#f8fafc";
}

// 時計の data-face-color 属性を読み取り、盤面に反映する
function applyFaceColor() {
  const swatches = getSwatches();
  if (swatches.length === 0) {
    console.warn("カラーパレットに色が登録されていません。");
    return;
  }

  const name = clock.dataset.faceColor;
  let swatch = findSwatch(name);

  if (!swatch) {
    console.warn(
      `data-face-color="${name}" はパレットに登録されていません。` +
      `先頭の色 "${swatches[0].dataset.colorName}" を使います。`
    );
    swatch = swatches[0];
  }

  const color = swatch.dataset.color;
  clock.style.setProperty("--face-color", color);
  clock.style.setProperty("--ink-color", pickInkColor(color));

  // 選択中のボタンに印をつける
  swatches.forEach((s) => {
    s.setAttribute("aria-pressed", String(s === swatch));
  });
}

function setupPalette() {
  // 各ボタンに data-color の色を見本として表示する
  getSwatches().forEach((swatch) => {
    swatch.style.setProperty("--swatch-color", swatch.dataset.color);
    swatch.setAttribute("type", "button");
    swatch.setAttribute("aria-pressed", "false");
  });

  // ボタンを押したら、時計の data-face-color 属性を書き換える
  // (属性の変化は下の MutationObserver が検知して色を反映する)
  palette.addEventListener("click", (event) => {
    const swatch = event.target.closest(".swatch");
    if (!swatch) return;
    clock.dataset.faceColor = swatch.dataset.colorName;
  });

  // data-face-color 属性が書き換わったら盤面の色を更新する。
  // ブラウザの開発者ツールで属性を直接編集しても反映されます。
  const observer = new MutationObserver(applyFaceColor);
  observer.observe(clock, { attributes: true, attributeFilter: ["data-face-color"] });
}

/* ---------- 起動 ---------- */

createTicks();
updateClock();
setInterval(updateClock, 1000);

setupPalette();
applyFaceColor();
