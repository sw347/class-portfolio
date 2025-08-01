const allContainer = document.querySelectorAll(".my-info> div");
const backgroundImages = document.querySelectorAll(".fix-profile > img");
const topBtn = document.querySelector(".topBtn");

const portfolioBtn = document.querySelector(".portfolioBtn");
const portfolioClose = document.querySelector(".portfolioClose");
const portfolio = document.querySelector(".portfolio");

let idx;
let pastEl;

const option = {
  threshold: 0.6,
};

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target === allContainer[4]) {
        topBtn.style.display = "block";
      } else {
        if (topBtn.style.display != "none") topBtn.style.display = "none";
      }

      pastEl = [...backgroundImages].filter((item) =>
        item.classList.contains("active")
      );

      pastEl[0].classList.remove("active");
      pastEl[0].classList.add("inactive");
      pastEl.shift();

      idx = [...allContainer].indexOf(entry.target);
      backgroundImages[idx].classList.remove("inactive");
      backgroundImages[idx].classList.add("active");
    }
  });
};

const io = new IntersectionObserver(callback, option);

allContainer.forEach((item) => io.observe(item));

topBtn.addEventListener("click", () => {
  window.scroll({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
});

let checkPortfolio = true;

portfolioBtn.addEventListener("click", () => {
  if (checkPortfolio) {
    portfolio.style.left = "50%";
    portfolioBtn.classList.add("activePortfolioBtn");
  } else {
    portfolio.style.left = "100%";
    portfolioBtn.classList.remove("activePortfolioBtn");
  }

  checkPortfolio = !checkPortfolio;
});

portfolioClose.addEventListener("click", () => {
  portfolio.style.left = "100%";
});
