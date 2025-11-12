console.log((82 % 28) + 1);

const mainEl = document.querySelector("main");
const slider = document.getElementById("slider");
const start = document.getElementById("start");
const out = document.getElementById("output");
const outList = document.getElementById("outList");
const unit = 24;

let value = 10;
let list = createRandomNums(1, 12, 12);
let originalList = [...list];
let stopSorting = false;
let isSorting = false;
let comparisons = 0;
let swaps = 0;

// == init ==
render(mainEl, list);
originalList = [...list];
updateOutput();

// === Генерация массива ===
function createRandomNums(start, end, amount) {
  const arr = [];
  for (let i = 0; i < amount; i++) {
    arr.push(Math.floor(Math.random() * (end - start + 1)) + start);
  }
  return arr;
}

function updateOutput() {
  out.textContent = originalList.join(", ");
  outList.textContent = list.join(", ");
}

// === Слайдер ===
slider.addEventListener("input", (e) => {
  stopSorting = true;
  value = +e.target.value;
  document.documentElement.style.setProperty("--amount", value);
  list = createRandomNums(1, 15, value);
  originalList = [...list];
  render(mainEl, list);
  updateOutput();
});

// === Визуализация ===
function render(el, arr) {
  el.innerHTML = "";
  arr.forEach((num, i) => {
    const div = document.createElement("div");
    div.className = "bar";
    div.id = i;
    div.style.height = `${unit * num}px`;
    div.style.transform = `translateX(${i * unit}px)`;
    el.append(div);
  });
}

// === Сортировка расчёской ===
async function startSort(arr) {
  if (isSorting) return;
  isSorting = true;
  stopSorting = false;
  comparisons = 0;
  swaps = 0;

  let gap = arr.length;
  const shrink = 1.3;
  let sorted = false;

  while (!sorted && !stopSorting) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < arr.length; i++) {
      if (stopSorting) break;

      comparisons++;
      if (arr[i] > arr[i + gap]) {
        swap(i, i + gap);
        swaps++;
        sorted = false;
        await sleep(1000);
      }
    }
  }

  isSorting = false;
  showStats();
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function swap(i, j) {
  [list[i], list[j]] = [list[j], list[i]];
  updateOutput();

  const left = document.getElementById(`${i}`);
  const right = document.getElementById(`${j}`);
  if (!left || !right) return;

  const leftX = left.style.transform;
  const rightX = right.style.transform;

  left.style.background = "rgba(200,200,200,0.6)";
  right.style.background = "rgba(200,200,200,0.6)";

  left.style.transform = rightX;
  right.style.transform = leftX;

  left.id = `${j}`;
  right.id = `${i}`;

  setTimeout(() => {
    left.style.background = "linear-gradient(red, rgb(42,3,3))";
    right.style.background = "linear-gradient(red, rgb(42,3,3))";
  }, 300);
}

function showStats() {
  alert(
    `Сортировка завершена\nСравнений: ${comparisons}\nПерестановок: ${swaps}`
  );
}

// === Поиск ===
function findByValue(value) {
  const index = list.indexOf(value);
  return index !== -1
    ? `Элемент ${value} найден на позиции ${index}`
    : "Элемент не найден";
}

function findByIndex(index) {
  if (index < 0 || index >= list.length) return "Некорректный индекс";
  return `Элемент на позиции ${index}: ${list[index]}`;
}

function findKthSmallest(k) {
  if (k < 0 || k > list.length) return "Некорректное значение k";
  const sorted = [...list].sort((a, b) => a - b);
  return `k-ое (${k}) по порядку число: ${sorted[k]}`;
}

// === Добавление и удаление ===
function addElement(value) {
  list.push(value);
  updateOutput();
  render(mainEl, list);
}

function removeElement(index) {
  if (index < 0 || index >= list.length) return alert("Некорректный индекс");
  list.splice(index, 1);
  updateOutput();
  render(mainEl, list);
}

// === Кнопки ===
start.addEventListener("click", () => startSort(list));

document.getElementById("btnFindValue").onclick = () => {
  const v = +document.getElementById("findValue").value;
  alert(findByValue(v));
};

document.getElementById("btnFindIndex").onclick = () => {
  const i = +document.getElementById("findIndex").value;
  alert(findByIndex(i));
};

document.getElementById("btnAdd").onclick = () => {
  const v = +document.getElementById("addValue").value;
  if (isNaN(v)) return alert("Введите число");
  addElement(v);
};

document.getElementById("btnRemove").onclick = () => {
  const i = +document.getElementById("removeIndex").value;
  if (isNaN(i)) return alert("Введите индекс");
  removeElement(i);
};

document.getElementById("btnFindKth").onclick = () => {
  const k = +document.getElementById("findKth").value;
  alert(findKthSmallest(k));
};
