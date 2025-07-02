const mainEl = document.querySelector("main");
const slider = document.getElementById("slider");
const start = document.getElementById("start");
const out = document.getElementById("output");
const outList = document.getElementById("outList");
const unit = 24;
let value = 10;
let list = createRadomNums(1, 12, 12);
out.innerText = list;
outList.innerText = list;

let stopSorting = false;
let isSorting = false;

// ==render preview==
render(mainEl, list);
// ==================

/**
 *
 * @param {number} start start range value
 * @param {number} end end range value
 * @param {number} amount amount of numbers to output
 */
function createRadomNums(start, end, amount) {
  let list = [];
  if (start > end) {
    throw new Error("start cant be more then end");
  }
  for (let i = 0; i < amount; i++) {
    list[i] = Math.floor(Math.random() * (end - start + 1)) + start;
  }
  return list;
}
/**
 * @param {EventTarget} e
 */
slider.addEventListener("input", (e) => {
  stopSorting = true;
  value = e.target.value;
  document.documentElement.style.setProperty("--amount", value);
  list = createRadomNums(1, 15, value);
  out.innerText = list;
  render(mainEl, list);
});

/**
 * @param {HTMLElement} el
 * @param {Array} list
 */
function render(el, list) {
  el.innerHTML = "";

  for (let i = 0; i < list.length; i++) {
    const div = document.createElement("div");
    div.id = i;
    div.classList = "bar";
    div.style.height = `${unit * list[i]}px`;
    div.style.transform = `translateX(${i * unit}px)`;
    el.append(div);
  }
}
/**
 *
 * @param {Array} list
 */
async function startSort(list) {
  if (isSorting) {
    return;
  }
  isSorting = true;
  stopSorting = false;
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length - i - 1; j++) {
      if (stopSorting) {
        isSorting = false;
        return;
      }
      if (list[j] > list[j + 1]) {
        swap(j, j + 1);
        await sleep(400);
      }
    }
  }
  isSorting = false;
}
/**
 *
 * @param {Number} ms
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 *
 * @param {Number} i
 * @param {Number} j
 */
function swap(i, j) {
  [list[i], list[j]] = [list[j], list[i]];
  outList.innerText = list;
  const left = document.getElementById(`${i}`);
  const right = document.getElementById(`${j}`);

  left.style.background = "rgba(200, 200, 200, 0.52)";
  left.style.zIndex = 2;
  left.id = `${j}`;
  right.id = `${i}`;
  left.style.transform = `translateX(${j * unit}px)`;
  right.style.transform = `translateX(${i * unit}px)`;
  setTimeout(() => {
    left.style.background = " linear-gradient(red, rgb(42, 3, 3))";
    left.style.zIndex = 0;
  }, 300);
}

start.addEventListener("click", () => {
  startSort(list);
});
