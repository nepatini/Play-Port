const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const { app } = require('electron')

function createDatabase(filePath) {
    const db = new Database(filePath)

    db.prepare(`
        CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            gamePath TEXT NOT NULL,
            clientId INTEGER NOT NULL
        )
    `).run()

    function getGames(clientId) {
        return db.prepare(
            'SELECT * FROM games WHERE clientId = ?'
        ).all(clientId)
    }

    function addGame(name, gamePath, clientId) {
        name = name.trim()
        gamePath = gamePath.trim()

        if (name === '' || !gamePath.toLowerCase().endsWith('.exe')) {
            return 'invalid'
        }

        if (!fs.existsSync(gamePath)) {
            return 'invalid'
        }

        const games = getGames(clientId)

        for (const game of games) {
            if (game.name.toLowerCase() === name.toLowerCase()) {
                return 'duplicate'
            }

            if (game.gamePath.toLowerCase() === gamePath.toLowerCase()) {
                return 'duplicate'
            }
        }

        db.prepare(
            'INSERT INTO games (name, gamePath, clientId) VALUES (?, ?, ?)'
        ).run(name, gamePath, clientId)

        return 'success'
    }

    function deleteGame(gameId, clientId) {
        const result = db.prepare(
            'DELETE FROM games WHERE id = ? AND clientId = ?'
        ).run(gameId, clientId)

        return result.changes > 0
    }

    function close() {
        db.close()
    }

    return { getGames, addGame, deleteGame, close }
}

let database

function getDatabase() {
    if (!database) {
        const dbPath = path.join(app.getPath('userData'), 'playport.db')
        database = createDatabase(dbPath)
    }

    return database
}

module.exports = {
    createDatabase,
    getGames: (...args) => getDatabase().getGames(...args),
    addGame: (...args) => getDatabase().addGame(...args),
    deleteGame: (...args) => getDatabase().deleteGame(...args)
}