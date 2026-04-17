# App Feedback Survey

A small static survey app for collecting basic feedback about your app. It asks a few focused questions about satisfaction, usefulness, pain points, and feature requests, then shows the submitted responses on the page.

## Run locally

From this folder:

```bash
python -m http.server 8080
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

## What it does

- Uses preset app-feedback questions
- Shows a live progress indicator
- Saves draft answers in the browser
- Displays the submitted payload and a short summary

## Edit the questions

The survey questions live in `app.js` inside the `SURVEY_QUESTIONS` array. You can change the wording, add more questions, or swap question types there.
