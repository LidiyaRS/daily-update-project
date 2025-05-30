import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './DailyUpdates.css';

export default function DailyUpdates() {
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3000/api/dailyupdate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Daily update saved successfully!');
        history.push('/dashboard');
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Error saving daily update');
    }
  };

  return (
    <div className="du-container">
      <div className="du-card">
        <h1>📝 Daily Update</h1>
        <p className="du-subtitle">Share your thoughts and updates</p>
        <form onSubmit={handleSubmit} className="du-form">
          <input
            type="text"
            placeholder="Title"
            className="du-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="du-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows="4"
          />
          <input
            type="date"
            className="du-input"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
          <button type="submit" className="du-button">Submit</button>
          {message && <p className="du-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
