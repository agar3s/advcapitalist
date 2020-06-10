
const saveGame = (data) => {
  const request = new Request(
    'http://localhost:3000/games',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
    }
  )

  fetch(request)
    .then( response => response.json())
    .catch(console.error)
}

const loadGame = (id, callback) => {
  fetch(`http://localhost:3000/games/${id}`).then((response) => response.json())
    .then( response => callback(null, response))
    .catch(callback)
}

export default {
  saveGame,
  loadGame
}