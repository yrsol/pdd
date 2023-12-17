const questions = {};
const filePrefix = "questions/A_B/tickets/Билет ";
const filePostfix = ".json";
const fileNames = [];
const searchArray = [];

const qContainer = document.getElementById('q-container');

for (let i = 1; i <= 40; i++) {
  const fileName = `${filePrefix}${i}${filePostfix}`;
  fileNames.push(fileName);
}

const fetchData = async () => {
  const fetchPromises = fileNames.map(async (fileName) => {
    try {
      const response = await fetch(fileName);
      if (response.ok) {
        const data = await response.json();
        questions[fileName.match(/\d+/)[0]] = data;
      } else {
        throw new Error('Network response was not ok.');
      }
    } catch (error) {
      console.error(`Error fetching ${fileName}:`, error);
    }
  });

  await Promise.all(fetchPromises);
};

fetchData().then(() => {
  //console.log(questions);
  qContainer.innerHTML = "";
  const htmlContent = [];
  for (const ticket in questions) {
    const ticketData = questions[ticket];
    ticketData.forEach(question => {
      const questionId = question.ticket_number.match(/\d+/)[0] + "." + question.title.match(/\d+/)[0]
      const questionCorrectAnswer = question.correct_answer.match(/\d+/)[0] - 1;
      searchArray[questionId] = question.question.toLowerCase();
      if (question.image === "./images/no_image.jpg") {
        htmlContent.push(`
          <div class="question">
            <p class="question-text">${questionId} ${question.question}</p>
            <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
          </div>
        `);
      } else {
        htmlContent.push(`
          <div class="question">
            <p class="question-text">${questionId} ${question.question}</p>
            <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
            <img class="question-image" src="${question.image}" alt="${question.answer_tip}">
          </div>
        `);
      }
    });
  }
  //console.log(searchArray);
  qContainer.innerHTML = htmlContent.join('');
});

const searchInput = document.getElementById('search-input');
searchInput.oninput = searchQ;
document.getElementById('search-button').onclick = searchQ;
const message = document.getElementById('message');

function searchQ() {
  message.innerText = "";
  message.style.color = "initial";
  let count = 0;
  if (/^\s*$/.test(searchInput.value)) {
    const htmlContent = [];
    for (const ticket in questions) {
      const ticketData = questions[ticket];
      ticketData.forEach(question => {
        const questionId = question.ticket_number.match(/\d+/)[0] + "." + question.title.match(/\d+/)[0]
        const questionCorrectAnswer = question.correct_answer.match(/\d+/)[0] - 1;
        if (question.image === "./images/no_image.jpg") {
          htmlContent.push(`
            <div class="question">
              <p class="question-text">${questionId} ${question.question}</p>
              <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
            </div>
          `);
        } else {
          htmlContent.push(`
            <div class="question">
              <p class="question-text">${questionId} ${question.question}</p>
              <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
              <img class="question-image" src="${question.image}" alt="${question.answer_tip}">
            </div>
          `);
        }
        count += 1;
      });
    }
    qContainer.innerHTML = htmlContent.join('');
    message.innerText = "Найдено - " + count + " вопросов";
    message.style.color = "green";

  } else if (!isNaN(searchInput.value) && !searchInput.value.includes(" ")) {
    if (!searchInput.value.includes(".") || searchInput.value.split(".")[1] == '') {
      if (parseInt(searchInput.value, 10) > 40 || parseInt(searchInput.value, 10) < 1) {
        message.innerText = "Максимальный номер билета - 40";
        message.style.color = "red";
        return;
      }
      const htmlContent = [];
      questions[searchInput.value.split(".")[0]].forEach(question => {
        const questionId = question.ticket_number.match(/\d+/)[0] + "." + question.title.match(/\d+/)[0]
        const questionCorrectAnswer = question.correct_answer.match(/\d+/)[0] - 1;
        if (question.image === "./images/no_image.jpg") {
          htmlContent.push(`
            <div class="question">
              <p class="question-text">${questionId} ${question.question}</p>
              <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
            </div>
          `);
        } else {
          htmlContent.push(`
            <div class="question">
              <p class="question-text">${questionId} ${question.question}</p>
              <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
              <img class="question-image" src="${question.image}" alt="${question.answer_tip}">
            </div>
          `);
        }
        count += 1;
      });
      qContainer.innerHTML = htmlContent.join('');
      message.innerText = "Найдено - " + count + " вопросов";
      message.style.color = "green";

    } else {
      if (parseInt(searchInput.value.split(".")[0], 10) > 40 || parseInt(searchInput.value.split(".")[0], 10) < 1) {
        message.innerText = "Максимальный номер билета - 40";
        message.style.color = "red";
        return;
      }
      if (parseInt(searchInput.value.split(".")[1], 10) > 20 || parseInt(searchInput.value.split(".")[1], 10) < 1) {
        message.innerText = "Максимальный номер вопроса - 20";
        message.style.color = "red";
        return;
      }
      const question = questions[searchInput.value.split(".")[0]][searchInput.value.split(".")[1] - 1];
      const questionId = question.ticket_number.match(/\d+/)[0] + '.' + question.title.match(/\d+/)[0];
      const questionCorrectAnswer = question.correct_answer.match(/\d+/)[0] - 1;
      if (question.image === "./images/no_image.jpg") {
        qContainer.innerHTML = `
          <div class="question">
            <p class="question-text">${questionId} ${question.question}</p>
            <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
          </div>
        `;
      } else {
        qContainer.innerHTML = `
          <div class="question">
            <p class="question-text">${questionId} ${question.question}</p>
            <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
            <img class="question-image" src="${question.image}" alt="${question.answer_tip}">
          </div>
        `;
      }
      message.innerText = "Найден - 1 вопрос";
      message.style.color = "green";

    }
  } else {
    const matchingQuestions = Object.keys(searchArray).filter(key =>
      searchArray[key].startsWith(searchInput.value.toLowerCase())
    );

    if (matchingQuestions.length === 0) {
      message.innerText = "Ничего не найдено";
      message.style.color = "red";
      return;
    }

    const htmlContent = [];
    matchingQuestions.forEach(questionKey => {
      const question = questions[questionKey.split(".")[0]][questionKey.split(".")[1] - 1];
      const questionId = question.ticket_number.match(/\d+/)[0] + "." + question.title.match(/\d+/)[0]
      const questionCorrectAnswer = question.correct_answer.match(/\d+/)[0] - 1;
      if (question.image === "./images/no_image.jpg") {
        htmlContent.push(`
          <div class="question">
            <p class="question-text">${questionId} ${question.question}</p>
            <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
          </div>
        `);
      } else {
        htmlContent.push(`
          <div class="question">
            <p class="question-text">${questionId} ${question.question}</p>
            <p class="question-answer">${questionCorrectAnswer + 1}. ${question.answers[questionCorrectAnswer].answer_text}</p>
            <img class="question-image" src="${question.image}" alt="${question.answer_tip}">
          </div>
        `);
      }
    });
    qContainer.innerHTML = htmlContent.join('');
    message.innerText = "Найдено - " + matchingQuestions.length + " вопросов";
    message.style.color = "green";

  }
}
