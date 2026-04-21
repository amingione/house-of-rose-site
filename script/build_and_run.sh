#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-run}"
PORT="${PORT:-3000}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

stop_running_server() {
  local pids
  pids="$(lsof -ti tcp:"$PORT" || true)"
  if [[ -n "$pids" ]]; then
    kill $pids >/dev/null 2>&1 || true
    sleep 1
  fi

  pkill -f "next dev --port $PORT" >/dev/null 2>&1 || true
}

build_project() {
  npm run build
}

run_dev() {
  npm run dev -- --port "$PORT"
}

verify_server() {
  local verify_pid
  run_dev >/tmp/house-of-rose-dev.log 2>&1 &
  verify_pid=$!

  sleep 4

  if curl -fsS "http://localhost:$PORT" >/dev/null; then
    echo "Server verification passed on port $PORT"
  else
    echo "Server verification failed. See /tmp/house-of-rose-dev.log" >&2
    kill "$verify_pid" >/dev/null 2>&1 || true
    exit 1
  fi

  kill "$verify_pid" >/dev/null 2>&1 || true
}

stop_running_server
build_project

case "$MODE" in
  run)
    run_dev
    ;;
  --debug|debug)
    NODE_OPTIONS="--inspect" run_dev
    ;;
  --logs|logs)
    mkdir -p .logs
    run_dev 2>&1 | tee -a .logs/dev.log
    ;;
  --telemetry|telemetry)
    NEXT_TELEMETRY_DEBUG=1 run_dev
    ;;
  --verify|verify)
    npm run lint
    verify_server
    ;;
  *)
    echo "usage: $0 [run|--debug|--logs|--telemetry|--verify]" >&2
    exit 2
    ;;
esac
