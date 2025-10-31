import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// Axios instance using environment base URL (e.g., http://localhost:4000/api)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

const Body = () => {
  const [puppies, setPuppies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    weight_lbs: '',
    vaccinated: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (isEditing) {
        await api.put(`/puppies/${editId}`, formData)
      } else {
        await api.post('/puppies', formData)
      }
      await fetchPuppies()
      resetForm()
    } catch (err) {
      setError('Error saving puppy: ' + err.message)
    }
  }

  const handleEdit = (puppy) => {
    setIsEditing(true)
    setEditId(puppy.id)
    setFormData({
      name: puppy.name,
      breed: puppy.breed,
      weight_lbs: puppy.weight_lbs,
      vaccinated: puppy.vaccinated
    })
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/puppies/${id}`)
      await fetchPuppies()
    } catch (err) {
      setError('Error deleting puppy: ' + err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      breed: '',
      weight_lbs: '',
      vaccinated: false
    })
    setIsEditing(false)
    setEditId(null)
  }

  return (
    <main>
      <div className="container">
        {loading && <p>Loading puppies...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="form-container">
        <h2>{isEditing ? 'Edit Puppy' : 'Add New Puppy'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="breed">Breed:</label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="weight_lbs">Weight (lbs):</label>
            <input
              type="number"
              step="0.01"
              id="weight_lbs"
              name="weight_lbs"
              value={formData.weight_lbs}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="vaccinated">
              <input
                type="checkbox"
                id="vaccinated"
                name="vaccinated"
                checked={formData.vaccinated}
                onChange={handleInputChange}
              />
              Vaccinated
            </label>
          </div>
          <button type="submit">{isEditing ? 'Update' : 'Add'} Puppy</button>
          {isEditing && (
            <button type="button" onClick={resetForm}>Cancel</button>
          )}
        </form>
      </div>

      <div className="table-container">
        <h2>Puppies List</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Breed</th>
              <th>Weight (lbs)</th>
              <th>Arrival Date</th>
              <th>Vaccinated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {puppies.map((puppy) => (
              <tr key={puppy.id}>
                <td>{puppy.name}</td>
                <td>{puppy.breed}</td>
                <td>{puppy.weight_lbs}</td>
                <td>{new Date(puppy.arrival_date).toLocaleDateString()}</td>
                <td>{puppy.vaccinated ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(puppy)}>Edit</button>
                  <button onClick={() => handleDelete(puppy.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default Body
