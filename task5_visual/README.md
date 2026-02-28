# Task 5 Visual CMD Client

A separate command-line demo for Task 5 that turns API responses into terminal-friendly visuals.

## What it does
- Calls your local Task 5 API (`/api/tasks`) and shows CRUD results with tables.
- Calls a free API (`jsonplaceholder.typicode.com`) and renders:
  - a compact posts table
  - an ASCII bar chart grouped by `userId`

## Run
```bash
node task5_visual/cli.js
```

Optional: point to another local API base URL
```bash
LOCAL_API_BASE=http://127.0.0.1:4180/api node task5_visual/cli.js
```

If local API isn't running, the script still shows the free API visualization and prints a startup tip.
