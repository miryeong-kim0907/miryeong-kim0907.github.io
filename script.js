const photos = [
  { file: "20260927.jpg", date: "2026-09-27" },
  { file: "20261004_01.jpg", date: "2026-10-04" },
  { file: "20261102.jpg", date: "2026-11-02" },
  { file: "20261110_01.jpg", date: "2026-11-10" },
  { file: "20261110_02.jpg", date: "2026-11-10" },
  { file: "20261119_01.jpg", date: "2026-11-19" },
  { file: "20261119_02.jpg", date: "2026-11-19" },
  { file: "20261129_03.jpg", date: "2026-11-29" },
];

const grid = document.querySelector("#photo-grid");
const status = document.querySelector("#sort-status");
const count = document.querySelector("#photo-count");
const buttons = [...document.querySelectorAll(".sort-button")];

function mergeSort(items, compare) {
  if (items.length <= 1) return items;

  const middle = Math.floor(items.length / 2);
  const left = mergeSort(items.slice(0, middle), compare);
  const right = mergeSort(items.slice(middle), compare);
  const merged = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex]) <= 0) {
      merged.push(left[leftIndex++]);
    } else {
      merged.push(right[rightIndex++]);
    }
  }

  return merged.concat(left.slice(leftIndex), right.slice(rightIndex));
}

function compareByDate(a, b) {
  const dateOrder = a.date.localeCompare(b.date);
  return dateOrder || a.file.localeCompare(b.file, undefined, { numeric: true });
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

function render(order = "newest") {
  const sorted = mergeSort(photos, compareByDate);
  if (order === "newest") sorted.reverse();

  grid.replaceChildren(...sorted.map((photo, index) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.style.animationDelay = `${Math.min(index * 35, 210)}ms`;

    const link = document.createElement("a");
    link.className = "photo-link";
    link.href = `assets/${photo.file}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `${formatDate(photo.date)} 사진 원본 열기`);

    const image = document.createElement("img");
    image.src = `assets/${photo.file}`;
    image.alt = `${formatDate(photo.date)}에 찍은 사진`;
    image.loading = index < 4 ? "eager" : "lazy";
    image.decoding = "async";
    link.append(image);

    const caption = document.createElement("div");
    caption.className = "photo-caption";
    const date = document.createElement("time");
    date.className = "photo-date";
    date.dateTime = photo.date;
    date.textContent = formatDate(photo.date);
    const number = document.createElement("span");
    number.className = "photo-index";
    number.textContent = String(index + 1).padStart(2, "0");
    caption.append(date, number);
    card.append(link, caption);
    return card;
  }));

  const newestFirst = order === "newest";
  status.textContent = newestFirst ? "최신 날짜부터 보고 있어요" : "오래된 날짜부터 보고 있어요";
  count.textContent = `사진 ${sorted.length}장`;
  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.order === order));
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => render(button.dataset.order));
});

render("newest");

