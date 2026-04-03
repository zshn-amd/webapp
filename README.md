# Editable question form

A small static page: edit question text, answer in the browser, and submit (results are shown as JSON on the page—no backend).

## Run locally

From this folder:

```bash
python -m http.server 8080
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

## GitHub

Initialize and push (replace `YOUR_USER` and repo name):

```bash
git init
git add .
git commit -m "Add editable question form"
git branch -M main
git remote add origin https://github.com/YOUR_USER/editable-questions-app.git
git push -u origin main
```
