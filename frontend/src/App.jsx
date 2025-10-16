import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ADD THIS DEBUG LINE:
console.log('Environment check:', {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL: API_BASE_URL
});

function App() {
  const [participants, setParticipants] = useState([]);
  const [newParticipant, setNewParticipant] = useState({
    name: '',
    age: '',
    diagnosis: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch participants from backend
  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/participants`);
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  // Create new participant
  const createParticipant = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await axios.post(`${API_BASE_URL}/api/participants`, {
        name: newParticipant.name,
        age: parseInt(newParticipant.age),
        diagnosis: newParticipant.diagnosis
      });
      setNewParticipant({ name: '', age: '', diagnosis: '' });
      setSuccess('Participant added successfully!');
      fetchParticipants(); // Refresh the list
    } catch (error) {
      if (error.response && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to create participant');
      }
    }
  };

  // Load participants when component mounts
  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div className="app">
      <h1>Disability Care Management</h1>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="success-message">
          ✅ {success}
        </div>
      )}
      
      {/* Add Participant Form */}
      <div className="form-section">
        <h2>Add New Participant</h2>
        <form onSubmit={createParticipant} className="participant-form">
          <input
            type="text"
            placeholder="Name"
            value={newParticipant.name}
            onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={newParticipant.age}
            onChange={(e) => setNewParticipant({...newParticipant, age: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Diagnosis (e.g., Autism)"
            value={newParticipant.diagnosis}
            onChange={(e) => setNewParticipant({...newParticipant, diagnosis: e.target.value})}
            required
          />
          <button type="submit">Add Participant</button>
        </form>
      </div>

      {/* Participants List */}
      <div className="participants-section">
        <h2>Participants ({participants.length})</h2>
        <div className="participants-list">
          {participants.map(participant => (
            <div key={participant.id} className="participant-card">
              <h3>{participant.name}</h3>
              <p>Age: {participant.age}</p>
              <p>Diagnosis: {participant.diagnosis}</p>
              <small>Added: {new Date(participant.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;