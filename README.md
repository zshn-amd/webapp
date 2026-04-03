# Editable question form

A small static page: edit question text, answer in the browser, and submit (results are shown as JSON on the page—no backend).

## Run locally

From this folder:

```bash
python -m http.server 8080
```

Open [http://127.0.0.1:8080](http://127.0.0.1:8080).

## GitHub

This folder is already a Git repository on branch `main` with an initial commit.

### Option A: GitHub CLI (recommended)

1. Log in once: `gh auth login` (choose HTTPS, authenticate in the browser).
2. From this folder, create the remote repo and push:

```bash
gh repo create editable-questions-app --public --source=. --remote=origin --push
```

Use another repo name if `editable-questions-app` is already taken on your account.

### Option B: Manual remote

Create an empty repository on GitHub (no README), then:

```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Set your name and email for commits if needed: `git config user.name "..."` and `git config user.email "..."`.
