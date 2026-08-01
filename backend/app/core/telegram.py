"""Tiny Telegram notification helper.

Sends a plain-text message to a Telegram chat via the Bot API. Uses only the
standard library (urllib) so no new dependency is needed.

Never raises: any failure (missing config, network error, bad token, etc.)
is logged and swallowed, so a notification failure can never break the
request that triggered it (e.g. a student submitting the contact form).
"""

import json
import logging
import urllib.request

from app.core.config import settings

logger = logging.getLogger("telegram")


def send_telegram_notification(text: str) -> None:
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    if not token or not chat_id:
        logger.info("Telegram not configured — skipping notification")
        return

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            resp.read()
    except Exception as exc:  # noqa: BLE001 - notifications must never break the caller
        logger.warning("Telegram notification failed: %s", exc)