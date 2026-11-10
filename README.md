
# PlayPort

PlayPort is a simple desktop application for managing installed games.

## Technologies and versions

- Node.js 20 or newer
- npm 10 or newer
- Electron 45
- React 19
- TypeScript 7
- SQLite through better-sqlite3 13

## Features

- Add games manually
- Scan installed Steam games
- Search games by name
- Launch games
- Remove games from the library
- Detect duplicate games
- Store games in SQLite
- Separate game libraries for two clients

## How to run

Install Node.js 20 or newer, then install dependencies:

```bash
npm install
```

Start the complete desktop application with one command:

```bash
npm start
```

`npm start` first builds the React renderer and then starts Electron. If a Vite
development server is already running on port 5173, Electron uses it;
otherwise it loads the production build from `dist`.

For development with hot reload, use two terminals:

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run start
```

## Tests

Run all database tests:

```bash
npm test
```

The test suite contains six tests covering successful additions, invalid paths,
duplicate conflicts, deletion, and isolation between clients.

## Demonstration

1. Run `npm start`.
2. Select Client 1 and add a real `.exe` file using its full Windows path.
3. Confirm that the game appears in the library and can be launched.
4. Try adding the same game again and confirm that the duplicate is rejected.
5. Switch to Client 2 and confirm that Client 1's game is not visible.
6. Run `npm test` to verify the database rules and client isolation.
