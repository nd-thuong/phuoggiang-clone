#!/bin/sh
# Use this script to test if a given TCP host/port are available

# The MIT License (MIT)
# Copyright (c) 2016 Vincent Demeester

TIMEOUT=15
QUIET=0
HOST=""
PORT=""

echoerr() {
  if [ "$QUIET" -ne 1 ]; then echo "$@" 1>&2; fi
}

usage() {
  cat << USAGE >&2
Usage:
  $0 host:port [-t timeout] [-- command args]
  -h HOST | --host=HOST       Host or IP under test
  -p PORT | --port=PORT       TCP port under test
  -t TIMEOUT | --timeout=TIMEOUT
                              Timeout in seconds, zero for no timeout
  -q | --quiet                Do not output any status messages
  -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
  exit 1
}

wait_for() {
  if [ "$TIMEOUT" -gt 0 ]; then
    echoerr "$0: waiting $TIMEOUT seconds for $HOST:$PORT"
  else
    echoerr "$0: waiting for $HOST:$PORT without a timeout"
  fi
  start_ts=$(date +%s)
  while :; do
    if nc -z "$HOST" "$PORT"; then
      end_ts=$(date +%s)
      echoerr "$0: $HOST:$PORT is available after $((end_ts - start_ts)) seconds"
      break
    fi
    sleep 1
    curr_ts=$(date +%s)
    if [ "$TIMEOUT" -gt 0 ] && [ $((curr_ts - start_ts)) -ge "$TIMEOUT" ]; then
      echoerr "$0: timeout occurred after waiting $TIMEOUT seconds for $HOST:$PORT"
      exit 1
    fi
  done
  return 0
}

wait_for_wrapper() {
  if [ "$QUIET" -eq 1 ]; then
    exec 1>/dev/null
  fi
  wait_for "$@"
  exec "$@"
}

while [ $# -gt 0 ]; do
  case "$1" in
    *:* )
    HOST=$(printf "%s\n" "$1"| cut -d : -f 1)
    PORT=$(printf "%s\n" "$1"| cut -d : -f 2)
    shift 1
    ;;
    -h | --host)
    HOST="$2"
    if [ "$HOST" = "" ]; then break; fi
    shift 2
    ;;
    --host=*)
    HOST="${1#*=}"
    shift 1
    ;;
    -p | --port)
    PORT="$2"
    if [ "$PORT" = "" ]; then break; fi
    shift 2
    ;;
    --port=*)
    PORT="${1#*=}"
    shift 1
    ;;
    -t | --timeout)
    TIMEOUT="$2"
    if [ "$TIMEOUT" = "" ]; then break; fi
    shift 2
    ;;
    --timeout=*)
    TIMEOUT="${1#*=}"
    shift 1
    ;;
    -q | --quiet)
    QUIET=1
    shift 1
    ;;
    --)
    shift
    break
    ;;
    --help)
    usage
    ;;
    *)
    echoerr "Unknown argument: $1"
    usage
    ;;
  esac
done

if [ "$HOST" = "" ] || [ "$PORT" = "" ]; then
  echoerr "Error: you need to provide a host and port to test."
  usage
fi

wait_for_wrapper "$@"