const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { createDatabase } = require('../database.cjs')

function setup() {
    const folder = fs.mkdtempSync(
        path.join(os.tmpdir(), 'playport-test-')
    )

    const db = createDatabase(path.join(folder, 'test.db'))
    const exePath = path.join(folder, 'TestGame.exe')
    const secondPath = path.join(folder, 'SecondGame.exe')

    fs.writeFileSync(exePath, '')
    fs.writeFileSync(secondPath, '')

    return {
        db,
        exePath,
        secondPath,
        cleanup() {
            db.close()
            fs.rmSync(folder, { recursive: true, force: true })
        }
    }
}

test('Game is added successfully', () => {
    const { db, exePath, cleanup } = setup()

    try {
        const result = db.addGame('TestGame', exePath, 1)

        assert.equal(result, 'success')
        assert.equal(db.getGames(1).length, 1)
    } finally {
        cleanup()
    }
})

test('Duplicate game is rejected', () => {
    const { db, exePath, cleanup } = setup()

    try {
        db.addGame('TestGame', exePath, 1)

        const result = db.addGame('TestGame', exePath, 1)

        assert.equal(result, 'duplicate')
        assert.equal(db.getGames(1).length, 1)
    } finally {
        cleanup()
    }
})

test('Invalid game path is rejected', () => {
    const { db, cleanup } = setup()

    try {
        const result = db.addGame(
            'FakeGame',
            'C:\\NotExisting\\FakeGame.exe',
            1
        )

        assert.equal(result, 'invalid')
        assert.equal(db.getGames(1).length, 0)
    } finally {
        cleanup()
    }
})

test('Clients have separate games', () => {
    const { db, exePath, cleanup } = setup()

    try {
        db.addGame('TestGame', exePath, 1)

        assert.equal(db.getGames(1).length, 1)
        assert.equal(db.getGames(2).length, 0)

        const deleted = db.deleteGame(db.getGames(1)[0].id, 2)

        assert.equal(deleted, false)
        assert.equal(db.getGames(1).length, 1)
    } finally {
        cleanup()
    }
})

test('Same name with different path is rejected', () => {
    const { db, exePath, secondPath, cleanup } = setup()

    try {
        db.addGame('TestGame', exePath, 1)

        const result = db.addGame('testgame', secondPath, 1)

        assert.equal(result, 'duplicate')
        assert.equal(db.getGames(1).length, 1)
    } finally {
        cleanup()
    }
})

test('Same game can belong to different clients', () => {
    const { db, exePath, cleanup } = setup()

    try {
        const result1 = db.addGame('TestGame', exePath, 1)
        const result2 = db.addGame('TestGame', exePath, 2)

        assert.equal(result1, 'success')
        assert.equal(result2, 'success')
        assert.equal(db.getGames(1).length, 1)
        assert.equal(db.getGames(2).length, 1)
    } finally {
        cleanup()
    }
})