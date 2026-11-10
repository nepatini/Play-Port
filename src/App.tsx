import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [games, setGames] = useState<Game[]>([])
    const [clientId, setClientId] = useState(1)
    const [name, setName] = useState('')
    const [gamePath, setGamePath] = useState('')
    const [search, setSearch] = useState('')

    function loadGames() {
        window.electronAPI.getGames(clientId).then(data => {
            setGames(data)
        })
    }

    useEffect(() => {
        loadGames()
    }, [clientId])

    async function addGame() {
        if (name === '' || gamePath === '') {
            alert('Fill all fields')
            return
        }

        const result = await window.electronAPI.addGame(
            name, gamePath, clientId
        )

        if (result === 'success') {
            setName('')
            setGamePath('')
            loadGames()
        } else if (result === 'duplicate') {
            alert('Game already exists')
        } else {
            alert('Invalid .exe file')
        }
    }

    async function scanGames() {
        const added = await window.electronAPI.scanGames(clientId)
        alert('Added games: ' + added)
        loadGames()
    }

    async function playGame(gameId: number) {
        const result = await window.electronAPI.playGame(
            gameId, clientId
        )

        if (result === 'invalid') {
            alert('Game file not found')
        } else if (result === 'notfound') {
            alert('Game not found')
        } else if (result === 'error') {
            alert('Could not launch game')
        }
    }

    async function deleteGame(gameId: number) {
        const confirmed = confirm('Delete this game?')

        if (!confirmed) {
            return
        }

        const deleted = await window.electronAPI.deleteGame(
            gameId, clientId
        )

        if (deleted) {
            loadGames()
        } else {
            alert('Game not found')
        }
    }

    const filteredGames = games.filter(game =>
        game.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div>
            <h1>PlayPort</h1>

            <label>Client: </label>
            <select
                value={clientId}
                onChange={e => setClientId(Number(e.target.value))}
            >
                <option value={1}>Client 1</option>
                <option value={2}>Client 2</option>
            </select>

            <hr />

            <h2>Game Library</h2>

            <input
                placeholder="Game name"
                value={name}
                onChange={e => setName(e.target.value)}
            />

            <input
                placeholder="Game .exe path"
                value={gamePath}
                onChange={e => setGamePath(e.target.value)}
            />

            <button onClick={addGame}>Add Game</button>
            <button onClick={scanGames}>Scan Games</button>

            <br /><br />

            <input
                placeholder="Search games..."
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <h3>Games ({filteredGames.length})</h3>

            <ul>
                {filteredGames.map(game => (
                    <li key={game.id}>
                        {game.name}
                        {' '}
                        <button onClick={() => playGame(game.id)}>
                            Play
                        </button>
                        {' '}
                        <button onClick={() => deleteGame(game.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App