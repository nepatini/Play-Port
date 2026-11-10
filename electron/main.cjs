const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { spawn } = require('child_process')

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    })

    win.loadURL('http://localhost:5173').catch(() => {
        win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
    })
}

app.whenReady().then(() => {
    const database = require('./database.cjs')
    const scanner = require('./scanner.cjs')

    ipcMain.handle('getGames', (event, clientId) => {
        return database.getGames(clientId)
    })

    ipcMain.handle('addGame', (event, name, gamePath, clientId) => {
        return database.addGame(name, gamePath, clientId)
    })

    ipcMain.handle('deleteGame', (event, gameId, clientId) => {
        return database.deleteGame(gameId, clientId)
    })

    ipcMain.handle('scanGames', () => {
        return scanner.scanGames()
    })

    ipcMain.handle('playGame', (event, gameId, clientId) => {
        const game = database.getGames(clientId).find(
            game => game.id === gameId
        )

        if (!game) {
            return 'notfound'
        }

        if (!fs.existsSync(game.gamePath)) {
            return 'invalid'
        }

        try {
            const gameProcess = spawn(game.gamePath, [], {
                cwd: path.dirname(game.gamePath),
                detached: true,
                stdio: 'ignore'
            })

            gameProcess.on('error', error => {
                console.error('Game launch error:', error)
            })

            gameProcess.unref()

            return 'success'
        } catch (error) {
            return 'error'
        }
    })

    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})