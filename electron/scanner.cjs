const fs = require('fs')
const path = require('path')

function scanGames() {
    const games = []
    const steamPath = 'C:\\Program Files (x86)\\Steam\\steamapps'

    if (!fs.existsSync(steamPath)) {
        return games
    }

    const files = fs.readdirSync(steamPath)

    for (const file of files) {
        if (file.startsWith('appmanifest_') && file.endsWith('.acf')) {
            const content = fs.readFileSync(
                path.join(steamPath, file),
                'utf8'
            )

            const name = content.match(/"name"\s+"([^"]+)"/)
            const folder = content.match(/"installdir"\s+"([^"]+)"/)

            if (!name || !folder) {
                continue
            }

            const gameFolder = path.join(
                steamPath,
                'common',
                folder[1]
            )

            if (!fs.existsSync(gameFolder)) {
                continue
            }

            const gameFiles = fs.readdirSync(gameFolder)

            for (const gameFile of gameFiles) {
                if (gameFile.toLowerCase().endsWith('.exe')) {
                    games.push({
                        name: name[1],
                        gamePath: path.join(gameFolder, gameFile)
                    })
                    break
                }
            }
        }
    }

    return games
}

module.exports = { scanGames }