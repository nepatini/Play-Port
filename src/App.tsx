import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [games, setGames] = useState<Game[]>([])
    const [clientId, setClientId] = useState(1)
    const [name, setName] = useState('')
    const [gamePath, setGamePath] = useState('')
    const [search, setSearch] = useState('')

    const [scannedGames, setScannedGames] = useState<ScannedGame[]>([])
    const [selectedGames, setSelectedGames] = useState<string[]>([])
    const [showScan, setShowScan] = useState(false)
    const [busy, setBusy] = useState(false)

    function loadGames() {
        window.electronAPI.getGames(clientId).then(data => {
            setGames(data)
        })
    }

    useEffect(() => {
        loadGames()
        setScannedGames([])
        setSelectedGames([])
        setShowScan(false)
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
        setBusy(true)

        try {
            const found = await window.electronAPI.scanGames()

            const existingNames = games.map(game =>
                game.name.toLowerCase()
            )

            const available = found.filter(game =>
                !existingNames.includes(game.name.toLowerCase())
            )

            setScannedGames(available)
            setSelectedGames([])
            setShowScan(true)
        } catch {
            alert('Could not scan games')
        } finally {
            setBusy(false)
        }
    }

    function toggleGame(gamePath: string) {
        if (selectedGames.includes(gamePath)) {
            setSelectedGames(
                selectedGames.filter(p => p !== gamePath)
            )
        } else {
            setSelectedGames([...selectedGames, gamePath])
        }
    }

    async function addSelectedGames() {
        setBusy(true)
        let added = 0

        try {
            for (const game of scannedGames) {
                if (selectedGames.includes(game.gamePath)) {
                    const result = await window.electronAPI.addGame(
                        game.name,
                        game.gamePath,
                        clientId
                    )

                    if (result === 'success') {
                        added++
                    }
                }
            }

            alert('Added games: ' + added)
            setShowScan(false)
            setScannedGames([])
            setSelectedGames([])
            loadGames()
        } catch {
            alert('Could not add some games')
            loadGames()
        } finally {
            setBusy(false)
        }
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
                disabled={busy}
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

            <button onClick={addGame} disabled={busy}>
                Add Game
            </button>

            <button onClick={scanGames} disabled={busy}>
                Scan Games
            </button>

            {showScan && (
                <div>
                    <hr />
                    <h3>Scanned Games</h3>

                    <p>Select games to add to Client {clientId}:</p>

                    {scannedGames.length === 0 && (
                        <p>No new games found.</p>
                    )}

                    {scannedGames.map(game => (
                        <label
                            className="scan-game"
                            key={game.gamePath}
                        >
                            <input
                                type="checkbox"
                                checked={selectedGames.includes(game.gamePath)}
                                onChange={() => toggleGame(game.gamePath)}
                                disabled={busy}
                            />

                            <span>{game.name}</span>
                        </label>
                    ))}

                    <br />

                    <button
                        onClick={addSelectedGames}
                        disabled={busy || selectedGames.length === 0}
                    >
                        Add Selected Games ({selectedGames.length})
                    </button>

                    <button
                        disabled={busy}
                        onClick={() => setShowScan(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            <hr />

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