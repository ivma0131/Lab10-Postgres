import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Body from './components/Body'

function App() {
  const [puppies, setPuppies] = useState([])
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
      const response = await axios.get('/puppies')
      setPuppies(response.data)
    } catch (error) {
      console.error('Error fetching puppies:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }



  return (
    <div className="app">
      <Header />
      <Body 
        puppies={puppies}
        formData={formData}
        setFormData={setFormData}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editId={editId}
        setEditId={setEditId}
        fetchPuppies={fetchPuppies}
        handleInputChange={handleInputChange}
      />
      <Footer />
    </div>
  )
}

export default App
