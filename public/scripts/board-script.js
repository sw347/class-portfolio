const popup = document.querySelector(".popup-background");
const popupOpenBtn = document.querySelector(".btn");
const popupCloseBtn = document.querySelector(".popup-drop");

const titleBox = document.querySelector(".title");
const contentBox = document.querySelector(".content");
const popupSubmitBtn = document.querySelector(".popup-btn");

const board = document.querySelector(".board-content");
let itemList;
let itemFilteredList;

const highlighted = document.querySelector(".highlighted");

const searchItem = document.querySelector(".search-item");

const host = "https://board-server-vl1ncdtv5-lsws-projects-e9ef4d20.vercel.app";

const namedItem = (name) => {
  let named = document.createElement("div");
  named.className = name;

  return named;
};

const createItem = (el) => {
  let item = namedItem("item");
  let itemId = namedItem("item-id");
  let itemTitle = namedItem("item-title");
  let itemContent = namedItem("item-content");

  let itemDeleteBtn = namedItem("item-delete-btn");
  itemDeleteBtn.textContent = "삭제";

  itemDeleteBtn.addEventListener("click", () => {
    const check = confirm("정말 삭제하시겠습니까?");
    if (check) {
      fetch(`${host}/board/${itemId.textContent}`, {
        method: "delete",
      });
    }
    location.reload(true);
  });

  itemId.textContent = el.id;
  itemTitle.textContent = el.title;
  itemContent.textContent = el.content;

  item.append(itemId, itemTitle, itemContent, itemDeleteBtn);

  return item;
};

document.addEventListener("DOMContentLoaded", async () => {
  await fetch(
    `https://board-server-2dg9jtiyc-lsws-projects-e9ef4d20.vercel.app/board`,
    {
      method: "GET",
      mode: "cors",
      headers: { "Access-Control-Allow-Origin": "*" },
      credentials: "omit",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data != "") {
        [...data].forEach((el) => {
          board.appendChild(createItem(el));
        });
        highlighted.textContent = data.length;
      }
    });
});

popupOpenBtn.addEventListener("click", () => (popup.style.display = "flex"));

popupCloseBtn.addEventListener("click", () => (popup.style.display = "none"));

popupSubmitBtn.addEventListener("click", () => {
  title = titleBox.value.trim();
  content = contentBox.value.trim();

  if (title === "" || content === "") return;
  fetch(`${host}/board`, {
    method: "POST",
    mode: "cors",
    headers: { "Access-Control-Allow-Origin": "*" },
    credentials: "omit",
    body: JSON.stringify({
      title,
      content,
    }),
  });

  location.reload(true);
});

let intervalId = null;

const searchCallback = () => {
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    const searchKey = searchItem.value;
    itemList = document.querySelectorAll(".item");
    if (searchKey == "") {
      itemFilteredList = [...itemList].filter((item) => {
        // 여기부터 안됨
        item.children[1].indexOf(searchKey);
      });
      console.log(itemFilteredList);
    }
  }, 1500);
};
searchItem.addEventListener("focus", () => {
  searchCallback();
});

searchItem.addEventListener("blur", () => {
  clearInterval(intervalId);
  intervalId = null;
});
