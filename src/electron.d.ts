interface Game {
    id: number
    name: string
    gamePath: string
    clientId: number
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

        scanGames: (clientId: number) => Promise<number>

        playGame: (
            gameId: number,
            clientId: number
        ) => Promise<'success' | 'invalid' | 'notfound' | 'error'>
    }
}