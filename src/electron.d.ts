interface Game {
    id: number
    name: string
    gamePath: string
    clientId: number
}

interface ScannedGame {
    name: string
    gamePath: string
}

interface Window {
    electronAPI: {
        getGames: (clientId: number) => Promise<Game[]>

        addGame: (
            name: string,
            gamePath: string,
            clientId: number
        ) => Promise<'success' | 'duplicate' | 'invalid'>

        deleteGame: (
            gameId: number,
            clientId: number
        ) => Promise<boolean>

        scanGames: () => Promise<ScannedGame[]>

        playGame: (
            gameId: number,
            clientId: number
        ) => Promise<'success' | 'invalid' | 'notfound' | 'error'>
    }
}