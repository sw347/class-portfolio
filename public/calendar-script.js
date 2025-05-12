function generateCalendar(date, set = 0) {
  let calendarContainer = document.getElementById("calendar");

  let currentDate = date;

  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + set;

  if (month > 11) {
    year += Math.floor(month / 12);
    month %= 12;
  } else if (month < 0) {
    year -= Math.ceil(Math.abs(month) / 12);
    month = 11 + ((month + 1) % 12);
  }

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
        let style = "";
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
}

// 페이지 로드 시 달력 생성
window.onload = function () {
  generateCalendar(new Date());

  let count = 0;

  const beforeMonth = document.querySelector(".before-month");
  const nextMonth = document.querySelector(".next-month");

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

  nextMonth.addEventListener("click", () => {
    generateCalendar(new Date(), ++count);
  });

  beforeMonth.addEventListener("click", () => {
    generateCalendar(new Date(), --count);
  });
};
