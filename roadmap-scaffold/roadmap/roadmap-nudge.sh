#!/usr/bin/env bash
# roadmap-nudge.sh — desktop nudge that doubles as newsletter delivery.
# Shows the latest dispatch TL;DR as a notification; clicking "Read"
# opens LATEST.md. Zero API quota. Ubuntu/GNOME (notify-send >= 0.7.9).
#
# Install:
#   chmod +x roadmap-nudge.sh
#   crontab -e   # then e.g. weekdays at 9am:
#   0 9 * * 1-5 DISPLAY=:0 DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$(id -u)/bus /path/to/percolation-import/roadmap/roadmap-nudge.sh

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LATEST="$REPO_DIR/roadmap/reports/LATEST.md"

if [[ ! -f "$LATEST" ]]; then
  notify-send -a "EF-OS Roadmap" "No dispatches yet" \
    "Run /next in Claude Code inside percolation-import to start the loop."
  exit 0
fi

# Title = the dispatch's H1; body = TL;DR section text
TITLE=$(grep -m1 '^# ' "$LATEST" | sed 's/^# //')
TLDR=$(awk '/^## TL;DR/{f=1;next} /^## /{f=0} f && NF' "$LATEST" | head -4)

# Staleness hint: how long since the last dispatch changed
AGE_DAYS=$(( ( $(date +%s) - $(stat -c %Y "$LATEST") ) / 86400 ))
[[ $AGE_DAYS -ge 3 ]] && TLDR="$TLDR
(Last movement: ${AGE_DAYS}d ago — quota permitting, run /next.)"

# -A gives a clickable action; requires the process to wait for the click.
# Falls back to a plain notification if -A is unsupported.
if ACTION=$(notify-send -a "EF-OS Roadmap" -A "read=Read dispatch" \
    "$TITLE" "$TLDR" 2>/dev/null); then
  [[ "$ACTION" == "read" ]] && xdg-open "$LATEST"
else
  notify-send -a "EF-OS Roadmap" "$TITLE" "$TLDR
Open: $LATEST"
fi
