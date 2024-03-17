# Chat-Backend-API

This project is focused on developing the backend for a chat application that facilitates communication between clients and Chartered Accountants (CAs). It supports text and file exchanges, with clients using a web UI for interaction, and CAs using a Telegram bot for registration and communication.

## Overview

The backend is built using Node.js, Express for the API, SQLite for the database, and integrates a Telegram bot for CA interactions. WebSockets are used to manage real-time communication between clients and CAs. The project structure includes controllers for handling logic, models for database interactions, and utilities for supporting functionalities like WebSocket communication and Telegram bot interactions.

## Features

- **CA Registration via Telegram Bot**: CAs can register by providing their details through a Telegram bot.
- **Client-CA Matching**: Clients are matched with CAs based on language preferences.
- **Chat Functionality**: Supports text and file exchanges between clients and CAs.
- **Disconnecting Chats**: Allows for the disconnection and cleanup of chat sessions.

## API Endpoint Updates

#### CA Registration and Chat Notification
- Chartered Accountants (CAs) register through a Telegram bot by providing their details. Once registered, CAs receive notifications for new chat requests.
- **New Feature**: CAs already engaged in a chat session will not receive new chat notifications. This ensures that only available CAs are notified, optimizing the matching process and ensuring efficient use of resources.

#### Chat Functionality Enhancements
- The `/chat` endpoint has been enhanced to support direct file exchanges between clients and CAs. Previously, files were shared via links. Now, files can be sent directly, improving the user experience and ensuring secure and efficient file transfers.
- **Request Payload Changes**:
  - For sending messages, the payload remains the same.
  - For sending files, clients need to upload the file using the 'file' key in a multipart/form-data request. The backend handles the file upload and directly sends it to the matched CA's Telegram account.
- **Receiving Files**: CAs can directly receive files sent by clients in their Telegram chats, eliminating the need for accessing external links to view or download files.

## Getting started

### Requirements

- Node.js
- npm
- SQLite
- A Telegram bot token

### Quickstart

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Start the application with `npm start`.
4. Set up a Telegram bot and replace the token in `utilities/telegramBot.js`.

### License

Copyright (c) 2024.