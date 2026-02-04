# Socket.io Events Documentation

This document describes the events handled by the Socket.io server and the `chat.handler.js`.

## Connection Flow
1. **Connect**: Client connects to the server URL (e.g., `http://localhost:8080`).
2. **Register**: Client **MUST** emit `register` with `userId` to receive private messages.

## Events Listened (Server-Side)

### `connection`
- **Description**: Triggered when a client connects.
- **Payload**: Socket object.

### `register`
- **Description**: Registers a user ID with a socket ID for 1-on-1 messaging.
- **Payload**: `userId` (String) - The database ID of the user.

### `join_room`
- **Description**: Joins the socket to a specific chat room/channel.
- **Payload**: `object`
    - `chatId` (String): The ID of the chat document.

### `private_message`
- **Description**: Sends a message to another user or chat room.
- **Payload**: `object`
    - `chatId` (String, Optional): If known, the Chat ID. If omitted, tries to find/create based on participants.
    - `toUserId` (String): ID of the recipient.
    - `fromUserId` (String): ID of the sender.
    - `message` (String): Content of the message.
    - `type` (String, Default 'text'): Type of message ('text', 'image', 'location').

### `disconnect`
- **Description**: Triggered when client disconnects. Cleans up the `onlineUsers` map.

---

## Events Emitted (Client-Side Listeners)

### `receive_message`
- **Description**: Received when a new private message is sent to the user.
- **Payload**: `object` (Message Document)
    - `chat_id`: ID of the chat.
    - `sender_id`: ID of the sender.
    - `content`: Message text.
    - `type`: Message type.
    - `createdAt`: Timestamp.

### `message_sent`
- **Description**: Acknowledgment sent back to the sender after successful DB save.
- **Payload**: `object` (Message Document) - Same as above.

### `error`
- **Description**: Sent if message processing fails.
- **Payload**: `object`
    - `message`: Error description.
