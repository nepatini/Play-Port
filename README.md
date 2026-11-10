
# PlayPort

PlayPort is a simple desktop application for managing installed games.

## Technologies

- Electron
- React
- TypeScript
- SQLite

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

Install dependencies:

```bash
npm install
```

Start React:

```bash
npm run dev
```

Open another terminal and start Electron:

```bash
npx electron electron/main.cjs
```

## Tests

Run automated tests:

```bash
node --test electron/tests/database.test.cjs
```

The project contains 6 automated tests.
