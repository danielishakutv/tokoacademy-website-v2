#!/usr/bin/env bash
#
# Send one alert to Telegram. The message is read from stdin.
#
#     printf 'something broke' | bash scripts/telegram-alert.sh
#
# Used by the deploy-failure job in .github/workflows/deploy.yml and by
# .github/workflows/alert-test.yml. Both go through this one file on purpose: a
# test that exercises a different code path from the real alert proves nothing.
#
# It is deliberately loud. An alert that cannot be sent is worse than no alert
# at all, because the silence feels like good news — so a missing secret, a
# refused request or an unreachable Telegram each fail this step with the reason
# printed. The run goes red and says why.
#
# parse_mode is HTML, so the message may use <b>. It must NOT contain a raw
# &, < or > anywhere else; every caller here writes fixed text plus a URL.
set -euo pipefail

if [ -z "${TELEGRAM_BOT_TOKEN:-}" ] || [ -z "${TELEGRAM_CHAT_ID:-}" ]; then
  echo "::error::TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are not both set, so this alert was NOT sent and nobody has been told. Set them in the repository secrets."
  exit 1
fi

message=$(cat)
if [ -z "$message" ]; then
  echo "::error::refusing to send an empty alert"
  exit 1
fi

# Built with jq, so a message containing a quote or a newline cannot break the
# request body.
payload=$(jq -nc \
  --arg chat_id "$TELEGRAM_CHAT_ID" \
  --arg text "$message" \
  '{chat_id: $chat_id, text: $text, parse_mode: "HTML", disable_web_page_preview: true}')

# A forum group needs the topic id or the message lands in General.
if [ -n "${TELEGRAM_THREAD_ID:-}" ]; then
  payload=$(printf '%s' "$payload" | jq -c --argjson t "$TELEGRAM_THREAD_ID" '. + {message_thread_id: $t}')
fi

# The URL carries the bot token, so it is never echoed. --fail is deliberately
# NOT used: Telegram explains a rejection in the body, and that explanation is
# the whole value of this log line.
if ! response=$(curl -sS --max-time 20 -w $'\n%{http_code}' \
      -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -H 'Content-Type: application/json' \
      --data-binary "$payload" 2>&1); then
  echo "::error::could not reach api.telegram.org, so the alert was NOT sent: $response"
  exit 1
fi

code=$(printf '%s' "$response" | tail -n 1)
body=$(printf '%s' "$response" | sed '$d')

if [ "$code" != "200" ]; then
  # 401 = wrong bot token. 400 "chat not found" = wrong chat id. 400 "message
  # thread not found" = wrong topic id. 403 = the bot was never added to the
  # group, or was removed. Each needs a different fix, so the body is printed.
  echo "::error::Telegram refused the alert (HTTP $code): $body"
  exit 1
fi

echo "alert delivered to Telegram chat ${TELEGRAM_CHAT_ID}${TELEGRAM_THREAD_ID:+ (topic ${TELEGRAM_THREAD_ID})}"
