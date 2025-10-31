import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

const Body = () => {
  const [puppies, setPuppies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPuppies()
  }, [])

  const fetchPuppies = async () => {
    try {
      setLoading(true)
      const response = await api.get('/puppies')
      setPuppies(response.data)
      setError(null)
    } catch (err) {
      setError('Error fetching puppies: ' + err.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <main>
      <div className="container">
        {loading && <p>Loading puppies...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <div>
            <h2>Found {puppies.length} puppies</h2>
            {/* You can add your table or card components here to display the puppies */}
          </div>
        )}
      </div>
    </main>
  )
}

export default Body