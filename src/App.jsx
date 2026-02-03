import { useState, useEffect } from 'react'
import './styles/App.css'

function App() {
  const [cats, setCats] = useState([])
  const [selectedCats, setSelectedCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bestScore, setBestScore] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=10')
        if (!response.ok) {
          throw new Error('Failed to fetch cats')
        }
        const data = await response.json()
        setCats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCats()
  }, [])

  const handleCatClick = (catId) => {
    if (cats.some((cat) => cat.id === catId)) {
      setScore((prevScore) => prevScore + 1)
      setSelectedCats((prevSelectedCats) => [...prevSelectedCats, catId])
      setCats((prevCats) => [...prevCats].sort(() => Math.random() - 0.5))
      if (selectedCats.includes(catId)) {
        setBestScore((prevBestScore) => Math.max(prevBestScore, score))
        setScore(0)
        setSelectedCats([])
      }
      if (score === 10) {
        alert('You win!')
        setScore(0)
        setSelectedCats([])
      }
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="App">
      <h1>Memory Card Game</h1>
      {score === 10 ? (
        <p className='win'>You win!</p>
      ) : (
        <div className='scoreBoard'>
          <p className={`score ${score > bestScore ? 'new-best' : ''}`}>Score: {score}</p>
          <p className='bestScore'>Best Score: {bestScore}</p>
        </div>
      )}
      <div className="cat-grid">
        {cats.map((cat) => (
          <img key={cat.id} src={cat.url} alt="cat" onClick={() => handleCatClick(cat.id)} />
        ))}
      </div>
    </div>
  )
}

export default App