// ── Special dates: value locks to 5 ──
// Edit this array to add/remove dates (YYYY-MM-DD)

function todayKey() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function seededRandom(seed) {
  // simple mulberry32
  let t = seed | 0;
  return function () {
    t = (t + 0x6d2b79f5) | 0;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function dateToSeed(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  }
  return h;
}

function formatDate(key) {
  const [y, m, d] = key.split("-");
  return d + "/" + m + "/" + y;
}

(function init() {
  const key = todayKey();
  const isSpecial = window.SPECIAL_DATES.includes(key);

  document.getElementById("date").textContent = formatDate(key);

  const rng = seededRandom(dateToSeed(key));
  // Generate a value between 11 and 9001 (lol)
  const megaValue = Math.floor(rng() * 8990) + 11;
  const value = isSpecial ? 5 : megaValue;

  // percentage of the track (10 = 100%)
  const pct = (value / 10) * 100;
  const fill = document.getElementById("fill");
  const val = document.getElementById("val");
  const msg = document.getElementById("msg");

  fill.classList.add(isSpecial ? "normal" : "mega");

  // animate after a beat
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.width = pct + "%";
      val.textContent = value + " / 10";
    });
  });

  if (isSpecial) {
    msg.textContent = "Mi manchi comunque...";
  } else if (value > 100) {
    msg.textContent =
      "⚠️ ERRORE: valore MOLTO fuori scala. Pericolo imminente!";
  } else {
    msg.textContent = "⚠️ ERRORE: valore fuori scala.";
  }
})();
