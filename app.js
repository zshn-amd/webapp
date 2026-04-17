(function () {
  const STORAGE_KEY = "app-feedback-survey";

  const SURVEY_QUESTIONS = [
    {
      id: "satisfaction",
      type: "rating",
      title: "How satisfied are you with the app overall?",
      helpText: "Pick the option that best matches your experience.",
      options: ["Very satisfied", "Satisfied", "Neutral", "Unsatisfied", "Very unsatisfied"],
    },
    {
      id: "usefulness",
      type: "rating",
      title: "How useful is the app for what you need?",
      helpText: "This helps us understand whether the core value is landing.",
      options: ["Extremely useful", "Very useful", "Somewhat useful", "Not very useful"],
    },
    {
      id: "task",
      type: "text",
      title: "What do you use the app for most often?",
      helpText: "One short sentence is enough.",
      placeholder: "For example: tracking habits, managing projects, taking notes...",
    },
    {
      id: "painpoint",
      type: "textarea",
      title: "What is the most frustrating part of using the app?",
      helpText: "Be honest here. This is the most useful part of the survey.",
      placeholder: "Describe the biggest pain point...",
    },
    {
      id: "feature",
      type: "textarea",
      title: "If we could add one feature, what would it be?",
      helpText: "Think about the next thing that would make the app better.",
      placeholder: "A feature idea, workflow improvement, or integration...",
    },
    {
      id: "recommend",
      type: "yesno",
      title: "Would you recommend this app to someone else?",
      helpText: "A quick yes/no signal is enough for this one.",
      options: ["Yes", "Not yet"],
    },
  ];

  const form = document.getElementById("survey-form");
  const questionsEl = document.getElementById("survey-questions");
  const progressBar = document.getElementById("progress-bar");
  const progressLabel = document.getElementById("progress-label");
  const resultPanel = document.getElementById("result-panel");
  const resultJson = document.getElementById("result-json");
  const resultSummary = document.getElementById("result-summary");
  const dismissResult = document.getElementById("dismiss-result");
  const resetForm = document.getElementById("reset-form");

  const savedState = readSavedState();

  function readSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function saveState(values) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      // Ignore storage failures in private browsing or restricted modes.
    }
  }

  function createField(question) {
    const wrap = document.createElement("section");
    wrap.className = "question-block";

    const header = document.createElement("div");
    header.className = "question-copy";

    const title = document.createElement("h3");
    title.textContent = question.title;

    const help = document.createElement("p");
    help.className = "question-help";
    help.textContent = question.helpText;

    header.appendChild(title);
    header.appendChild(help);
    wrap.appendChild(header);

    if (question.type === "rating" || question.type === "yesno") {
      const choices = document.createElement("div");
      choices.className = "choice-list";
      question.options.forEach(function (option, index) {
        const id = `${question.id}-${index}`;
        const label = document.createElement("label");
        label.className = "choice-pill";
        label.setAttribute("for", id);

        const input = document.createElement("input");
        input.type = "radio";
        input.name = question.id;
        input.id = id;
        input.value = option;
        input.checked = savedState[question.id] === option;
        input.addEventListener("change", updateProgress);

        const text = document.createElement("span");
        text.textContent = option;

        label.appendChild(input);
        label.appendChild(text);
        choices.appendChild(label);
      });
      wrap.appendChild(choices);
      return wrap;
    }

    const control = question.type === "textarea" ? document.createElement("textarea") : document.createElement("input");
    control.className = "text-input";
    control.name = question.id;
    control.id = question.id;
    control.required = true;
    control.value = savedState[question.id] || "";
    control.placeholder = question.placeholder || "";
    control.addEventListener("input", function () {
      updateProgress();
      persistDraft();
    });

    if (question.type === "textarea") {
      control.rows = 4;
    } else {
      control.type = "text";
    }

    wrap.appendChild(control);
    return wrap;
  }

  function buildSurvey() {
    questionsEl.innerHTML = "";
    SURVEY_QUESTIONS.forEach(function (question) {
      questionsEl.appendChild(createField(question));
    });
    updateProgress();
  }

  function getCurrentValues() {
    const values = {};
    SURVEY_QUESTIONS.forEach(function (question) {
      if (question.type === "rating" || question.type === "yesno") {
        const checked = form.querySelector(`input[name="${question.id}"]:checked`);
        values[question.id] = checked ? checked.value : "";
        return;
      }

      const field = form.elements.namedItem(question.id);
      values[question.id] = field && typeof field.value === "string" ? field.value.trim() : "";
    });
    return values;
  }

  function persistDraft() {
    saveState(getCurrentValues());
  }

  function updateProgress(options) {
    const shouldPersist = !options || options.persistDraft !== false;
    const values = getCurrentValues();
    const answered = SURVEY_QUESTIONS.filter(function (question) {
      return Boolean(values[question.id]);
    }).length;
    const total = SURVEY_QUESTIONS.length;
    const percent = total ? Math.round((answered / total) * 100) : 0;

    progressBar.style.width = `${percent}%`;
    progressLabel.textContent = `${answered} of ${total} answered`;
    if (shouldPersist) {
      persistDraft();
    }
  }

  function renderSummary(values) {
    const satisfaction = values.satisfaction || "No response";
    const usefulness = values.usefulness || "No response";
    const recommend = values.recommend || "No response";

    resultSummary.innerHTML = `
      <dl class="summary-grid">
        <div>
          <dt>Satisfaction</dt>
          <dd>${escapeHtml(satisfaction)}</dd>
        </div>
        <div>
          <dt>Usefulness</dt>
          <dd>${escapeHtml(usefulness)}</dd>
        </div>
        <div>
          <dt>Recommend</dt>
          <dd>${escapeHtml(recommend)}</dd>
        </div>
      </dl>
    `;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const values = getCurrentValues();
    const missing = SURVEY_QUESTIONS.filter(function (question) {
      return !values[question.id];
    });

    if (missing.length) {
      const firstMissing = form.querySelector(`[name="${missing[0].id}"], #${missing[0].id}`);
      if (firstMissing && typeof firstMissing.focus === "function") {
        firstMissing.focus();
      }
      return;
    }

    const payload = {
      submittedAt: new Date().toISOString(),
      responses: values,
    };

    renderSummary(values);
    resultJson.textContent = JSON.stringify(payload, null, 2);
    resultPanel.hidden = false;
    resultPanel.classList.remove("hidden");
    resultPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  dismissResult.addEventListener("click", function () {
    resultPanel.hidden = true;
    resultPanel.classList.add("hidden");
  });

  resetForm.addEventListener("click", function () {
    form.reset();
    localStorage.removeItem(STORAGE_KEY);
    updateProgress({ persistDraft: false });
    resultPanel.hidden = true;
    resultPanel.classList.add("hidden");
  });

  buildSurvey();
})();
