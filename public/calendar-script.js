let url = null;
const serviceKey = decodeURI(
  "g2kzCadBgw+Z9bZGwt1tXs4RbTpTRIVoGhSAx9loGRIyCEH65Q0ashBsvunxPSUl7EqIEeu0qyIgTpS3etZLSQ=="
);

let year = null;
let month = null;
const holidays = [];
const holidaysCache = {};
const anniversarys = [];
const anniversarysCache = {};

async function checkholidays() {
  if (holidaysCache[year]) {
    // 이미 캐시에 있으면 복사해서 사용
    holidays.length = 0;
    holidays.push(...holidaysCache[year]);
    return;
  }

  url =
    "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

  const queryParams = new URLSearchParams({
    serviceKey: serviceKey,
    solYear: year,
  });

  await fetch(`${url}?${queryParams.toString()}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      const items = xmlDoc.getElementsByTagName("item");

      for (let i = 0; i < items.length; i++) {
        const locdate = items[i].getElementsByTagName("locdate")[0].textContent;
        holidays.push(locdate);
      }
    })
    .catch((error) => {
      console.error("에러 발생:", error);
      alert("에러 발생: 콘솔을 확인하세요.");
    });
}

async function checkAnniversary() {
  if (anniversarysCache[year]) {
    // 이미 캐시에 있으면 복사해서 사용
    anniversarys.length = 0;
    anniversarys.push(...anniversarysCache[year]);
    return;
  }

  url =
    "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getAnniversaryInfo";

  const queryParams = new URLSearchParams({
    serviceKey: serviceKey,
    solYear: year,
  });

  await fetch(`${url}?${queryParams.toString()}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.text();
    })
    .then((data) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");

      const items = xmlDoc.getElementsByTagName("item");

      for (let i = 0; i < items.length; i++) {
        const locdate = items[i].getElementsByTagName("locdate")[0].textContent;
        anniversarys.push(locdate);
      }
    })
    .catch((error) => {
      console.error("에러 발생:", error);
      alert("에러 발생: 콘솔을 확인하세요.");
    });
}

async function generateCalendar(date, set = 0) {
  let calendarContainer = document.getElementById("calendar");

  let currentDate = date;

  year = currentDate.getFullYear();
  month = currentDate.getMonth() + set;

  if (month > 11) {
    year += Math.floor(month / 12);
    month %= 12;
  } else if (month < 0) {
    year -= Math.ceil(Math.abs(month) / 12);
    month = 11 + ((month + 1) % 12);
  }

  holidays.length = 0;
  await checkholidays();
  await checkAnniversary();

  var calendarHTML = `<p>${year}년 ${month + 1}월</p>`;

  calendarHTML += "<table>";

  calendarHTML += "<tr>";
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  for (let day of daysOfWeek) {
    calendarHTML += `<th>${day}</th>`;
  }
  calendarHTML += "</tr>";

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  let dayCounter = 1;

  for (let i = 0; i < 6; i++) {
    calendarHTML += "<tr>";

    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        calendarHTML += "<td></td>";
      } else if (dayCounter > totalDaysInMonth) {
        calendarHTML += "<td></td>";
      } else {
        const dateStr =
          `${year}` +
          `${month + 1}`.padStart(2, "0") +
          `${dayCounter}`.padStart(2, "0");

        let style = "";
        if (holidays.includes(dateStr)) style += "color: green;"; // 공휴일
        if (anniversarys.includes(dateStr)) style += "color: violet";

        if (j === 0) style = "color: red;"; // 일요일 (빨간색)
        if (j === 6) style = "color: blue;"; // 토요일 (파란색)

        if (dayCounter == currentDate.getDate() && set == 0) {
          calendarHTML += `<td style="background-color: rgb(75, 117, 242); color: white; ${style}">${dayCounter}</td>`;
        } else {
          calendarHTML += `<td style="${style}">${dayCounter}</td>`;
        }
        dayCounter++;
      }
    }

    calendarHTML += "</tr>";

    if (dayCounter > totalDaysInMonth) {
      break;
    }
  }

  calendarHTML += "</table>";

  calendarContainer.innerHTML = calendarHTML;

  marker();
}

function marker() {
  const tdList = document.querySelectorAll("td");

  tdList.forEach((item) => {
    item.addEventListener("click", () => {
      if (item.classList.contains("toggle")) {
        tdList.forEach((item) => {
          item.classList.remove("toggle");
        });
        return;
      } else {
        tdList.forEach((item) => {
          item.classList.remove("toggle");
        });
      }

      if (item.textContent != "") item.classList.toggle("toggle");
    });
  });
}

// 페이지 로드 시 달력 생성
window.onload = async function () {
  await generateCalendar(new Date());

  let count = 0;

  const beforeMonth = document.querySelector(".before-month");
  const nextMonth = document.querySelector(".next-month");

  nextMonth.addEventListener("click", () => {
    generateCalendar(new Date(), ++count);
  });

  beforeMonth.addEventListener("click", () => {
    generateCalendar(new Date(), --count);
  });
};
