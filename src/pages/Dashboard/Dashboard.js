import React, { useState, useEffect } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/dailyupdate');
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setUpdates(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching updates');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Analytics
  const totalUpdates = updates.length;
  const updatesPerDay = totalUpdates > 0 ? (totalUpdates / new Set(updates.map(u => u.date)).size).toFixed(2) : 0;

  // Word frequency
  const wordFreq = {};
  updates.forEach((u) => {
    u.description.split(/\s+/).forEach((word) => {
      const w = word.toLowerCase().replace(/[^\w]/g, '');
      if (w) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
  });
  const topWord = Object.entries(wordFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Phrase frequency (bigrams)
  const bigramFreq = {};
  updates.forEach((u) => {
    const words = u.description.toLowerCase().split(/\s+/).map(w => w.replace(/[^\w]/g, ''));
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      bigramFreq[bigram] = (bigramFreq[bigram] || 0) + 1;
    }
  });
  const topPhrase = Object.entries(bigramFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <aside className="analytics">
        <h2>📊 Analytics</h2>
        <p><strong>Total Updates:</strong> {totalUpdates}</p>
        <p><strong>Avg. Updates/Day:</strong> {updatesPerDay}</p>
        <p><strong>Top Word:</strong> {topWord}</p>
        <p><strong>Top Phrase:</strong> {topPhrase}</p>
      </aside>
      <main className="updates-list">
        <h1>📅 Dashboard</h1>
        {updates.length === 0 ? (
          <p>No updates found.</p>
        ) : (
          updates.map((u) => (
            <div key={u.id} className="update-card">
              <div className="update-date">{new Date(u.date).toLocaleDateString()}</div>
              <h2 className="update-title">{u.title}</h2>
              <p className="update-description">{u.description}</p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
