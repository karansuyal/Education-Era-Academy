"""
Tiny in-memory WebSocket broadcast hub.

Each ConnectionManager instance is one "channel" — a list of currently
open sockets plus a broadcast() that fans a message out to all of them.

NOTE: this is in-memory, so it only works correctly with a single
backend process/worker (Render's default web service = 1 instance,
which is what this project runs on). If this ever moves to multiple
workers/instances, broadcasts would need to go through something
shared like Redis pub/sub instead.
"""
import asyncio
import json
from typing import Any

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._connections: list[WebSocket] = []
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.append(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            if websocket in self._connections:
                self._connections.remove(websocket)

    async def broadcast(self, message: dict[str, Any]) -> None:
        data = json.dumps(message, default=str)
        async with self._lock:
            targets = list(self._connections)

        dead: list[WebSocket] = []
        for connection in targets:
            try:
                await connection.send_text(data)
            except Exception:
                dead.append(connection)

        if dead:
            async with self._lock:
                for connection in dead:
                    if connection in self._connections:
                        self._connections.remove(connection)


# One channel for the public/admin doubts feed, one for admin leads.
doubts_hub = ConnectionManager()
leads_hub = ConnectionManager()
