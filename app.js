(function () {
  const DEFAULT_QUESTIONS = [
    "What is the main goal you want to achieve?",
    "What constraints or deadlines should we know about?",
    "Anything else we should consider?",
  ];

  const questionsEl = document.getElementById("questions");
  const form = document.getElementById("question-form");
  const addBtn = document.getElementById("add-question");
  const resultPanel = document.getElementById("result-panel");
  const resultJson = document.getElementById("result-json");
  const dismissResult = document.getElementById("dismiss-result");

  let nextId = 0;

  function createQuestionBlock(questionText) {
    const id = nextId++;
    const wrap = document.createElement("div");
    wrap.className = "question-block";
    wrap.dataset.qid = String(id);

    const label = document.createElement("label");
    label.setAttribute("for", `q-title-${id}`);
    label.textContent = "Question";

    const title = document.createElement("textarea");
    title.className = "question-title";
    title.id = `q-title-${id}`;
    title.rows = 2;
    title.required = true;
    title.value = questionText;
    title.setAttribute("aria-label", "Question text");

    const ansLabel = document.createElement("label");
    ansLabel.setAttribute("for", `q-ans-${id}`);
    ansLabel.textContent = "Your answer";

    const answer = document.createElement("textarea");
    answer.className = "answer";
    answer.id = `q-ans-${id}`;
    answer.rows = 4;
    answer.required = true;
    answer.placeholder = "Type your answer…";
    answer.setAttribute("aria-label", "Answer");

    const actions = document.createElement("div");
    actions.className = "question-actions";
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "btn-remove";
    remove.textContent = "Remove";
    remove.addEventListener("click", function () {
      if (questionsEl.querySelectorAll(".question-block").length <= 1) return;
      wrap.remove();
    });
    actions.appendChild(remove);

    wrap.appendChild(label);
    wrap.appendChild(title);
    wrap.appendChild(ansLabel);
    wrap.appendChild(answer);
    wrap.appendChild(actions);
    return wrap;
  }

  function initQuestions() {
    questionsEl.innerHTML = "";
    DEFAULT_QUESTIONS.forEach(function (q) {
      questionsEl.appendChild(createQuestionBlock(q));
    });
  }

  addBtn.addEventListener("click", function () {
    questionsEl.appendChild(createQuestionBlock("New question — edit this text"));
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const blocks = questionsEl.querySelectorAll(".question-block");
    const payload = [];
    blocks.forEach(function (block) {
      const title = block.querySelector(".question-title");
      const answer = block.querySelector(".answer");
      payload.push({
        question: (title && title.value) || "",
        answer: (answer && answer.value) || "",
      });
    });
    resultJson.textContent = JSON.stringify(payload, null, 2);
    resultPanel.hidden = false;
    resultPanel.classList.remove("hidden");
    resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  dismissResult.addEventListener("click", function () {
    resultPanel.hidden = true;
    resultPanel.classList.add("hidden");
  });

  initQuestions();
})();
