const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getGames: (clientId) =>
        ipcRenderer.invoke('getGames', clientId),

    addGame: (name, gamePath, clientId) =>
        ipcRenderer.invoke('addGame', name, gamePath, clientId),

    deleteGame: (gameId, clientId) =>
        ipcRenderer.invoke('deleteGame', gameId, clientId),

    scanGames: (clientId) =>
        ipcRenderer.invoke('scanGames', clientId),

    playGame: (gameId, clientId) =>
        ipcRenderer.invoke('playGame', gameId, clientId)
})