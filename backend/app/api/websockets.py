from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json

class ConnectionManager:
    """Manages active WebSocket dashboard connections."""

    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, event_type: str, data: Dict[str, Any]):
        payload = json.dumps({"type": event_type, "data": data})
        for connection in self.active_connections:
            try:
                await connection.send_text(payload)
            except Exception:
                pass

ws_manager = ConnectionManager()
