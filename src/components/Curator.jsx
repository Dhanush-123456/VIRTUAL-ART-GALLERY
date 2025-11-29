import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { artworks as initialArtworks } from '../data/artworks';

const Curator = ({ user, onLogin, onLogout }) => {
  if (!user || user.role !== 'curator') {
    return <Login onLogin={onLogin} />;
  }

  const [exhibitions, setExhibitions] = useState([
    { id: 1, title: 'Modern Art Exhibition', artworks: ['Sunset Painting', 'Abstract Art'] }
  ]);

  const [artworks, setArtworks] = useState(initialArtworks);

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newExhibition, setNewExhibition] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    location: '',
    ticketPrice: ''
  });

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showInsightsForm, setShowInsightsForm] = useState(false);
  const [selectedExhibitionForArtworks, setSelectedExhibitionForArtworks] = useState(null);
  const [insights, setInsights] = useState([
    { id: 1, title: 'Understanding Color Theory', content: 'How artists use color to evoke emotion and meaning in their work.', artworkId: null, date: '2024-01-10' },
    { id: 2, title: 'Exhibition Design Principles', content: 'Best practices for creating engaging and educational art exhibitions.', artworkId: null, date: '2024-01-08' }
  ]);
  const [newInsight, setNewInsight] = useState({
    title: '',
    content: '',
    artworkId: null
  });
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artist: '',
    year: '',
    image: '',
    description: '',
    history: '',
    artistBio: '',
    culturalSignificance: '',
    virtualTourUrl: '',
    price: '',
    status: 'available'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExhibition(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArtworkInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtwork(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const exhibition = {
      id: exhibitions.length + 1,
      ...newExhibition,
      status: 'upcoming',
      artworks: [],
      curator: user.username
    };
    setExhibitions(prev => [...prev, exhibition]);
    setNewExhibition({
      title: '',
      description: '',
      theme: '',
      startDate: '',
      endDate: '',
      location: '',
      ticketPrice: ''
    });
    setShowCreateForm(false);
    alert('Exhibition created successfully!');
  };

  const handleArtworkSubmit = (e) => {
    e.preventDefault();
    if (newArtwork.id) {
      // Edit existing
      setArtworks(prev => prev.map(art => art.id === newArtwork.id ? { ...newArtwork, curatorId: user.id } : art));
      alert('Artwork updated successfully!');
    } else {
      // New upload
      const artwork = {
        id: artworks.length + 1,
        ...newArtwork,
        curatorId: user.id,
        exhibitionId: null
      };
      setArtworks(prev => [...prev, artwork]);
      alert('Artwork uploaded successfully!');
    }
    setNewArtwork({
      title: '',
      artist: '',
      year: '',
      image: '',
      description: '',
      history: '',
      artistBio: '',
      culturalSignificance: '',
      virtualTourUrl: '',
      price: '',
      status: 'available'
    });
    setShowUploadForm(false);
  };

  const handleDeleteArtwork = (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      setArtworks(prev => prev.filter(art => art.id !== id));
      alert('Artwork deleted successfully!');
    }
  };

  const handleEditArtwork = (artwork) => {
    setNewArtwork(artwork);
    setShowUploadForm(true);
  };

  const handleInsightSubmit = (e) => {
    e.preventDefault();
    const insight = {
      id: insights.length + 1,
      ...newInsight,
      date: new Date().toISOString().split('T')[0],
      curator: user.username
    };
    setInsights(prev => [...prev, insight]);
    setNewInsight({ title: '', content: '', artworkId: null });
    setShowInsightsForm(false);
    alert('Insight published successfully!');
  };

  const handleAssignArtworkToExhibition = (exhibitionId, artworkId) => {
    setExhibitions(prev => prev.map(ex => {
      if (ex.id === exhibitionId) {
        const artworks = ex.artworks || [];
        if (!artworks.includes(artworkId)) {
          return { ...ex, artworks: [...artworks, artworkId] };
        }
      }
      return ex;
    }));
    alert('Artwork assigned to exhibition!');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Curator Dashboard</h1>
        <p>Welcome, {user.username}! Curate exhibitions and provide artistic insights.</p>
      </div>

      <div className="curator-stats">
        <div className="stat-card">
          <h3>🏛️ Total Exhibitions</h3>
          <p className="stat-number">{exhibitions.length}</p>
        </div>
        <div className="stat-card">
          <h3>👥 Visitors</h3>
          <p className="stat-number">8,450</p>
        </div>
        <div className="stat-card">
          <h3>⭐ Avg Rating</h3>
          <p className="stat-number">4.9</p>
        </div>
        <div className="stat-card">
          <h3>📅 This Month</h3>
          <p className="stat-number">2</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <button
          className="action-btn primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : '🏛️ Create Exhibition'}
        </button>
        <button
          className="action-btn primary"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : '🖼️ Upload Artwork'}
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => setShowInsightsForm(!showInsightsForm)}
        >
          {showInsightsForm ? 'Cancel' : '📝 Write Insights'}
        </button>
        <button className="action-btn secondary">
          📊 Analytics
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-container">
          <h2>Create New Exhibition</h2>
          <form onSubmit={handleSubmit} className="create-form">
            <div className="form-row">
              <div className="form-group">
                <label>Exhibition Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newExhibition.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Theme</label>
                <input
                  type="text"
                  name="theme"
                  value={newExhibition.theme}
                  onChange={handleInputChange}
                  placeholder="e.g., Renaissance Innovation"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newExhibition.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe the exhibition concept..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={newExhibition.startDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={newExhibition.endDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newExhibition.location}
                  onChange={handleInputChange}
                  placeholder="Gallery Hall A"
                />
              </div>
              <div className="form-group">
                <label>Ticket Price ($)</label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={newExhibition.ticketPrice}
                  onChange={handleInputChange}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Create Exhibition</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showInsightsForm && (
        <div className="upload-form-container">
          <h2>Write Curatorial Insight</h2>
          <form onSubmit={handleInsightSubmit} className="upload-form">
            <div className="form-group">
              <label>Insight Title *</label>
              <input
                type="text"
                value={newInsight.title}
                onChange={(e) => setNewInsight(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="e.g., Understanding Color Theory in Renaissance Art"
              />
            </div>
            <div className="form-group">
              <label>Select Artwork (Optional)</label>
              <select
                value={newInsight.artworkId || ''}
                onChange={(e) => setNewInsight(prev => ({ ...prev, artworkId: e.target.value ? parseInt(e.target.value) : null }))}
              >
                <option value="">General Insight</option>
                {artworks.map(art => (
                  <option key={art.id} value={art.id}>{art.title} by {art.artist}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Insight Content *</label>
              <textarea
                value={newInsight.content}
                onChange={(e) => setNewInsight(prev => ({ ...prev, content: e.target.value }))}
                rows="8"
                required
                placeholder="Provide your curatorial insights, analysis, and educational content about the artwork or art movement..."
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Publish Insight</button>
              <button type="button" onClick={() => {
                setShowInsightsForm(false);
                setNewInsight({ title: '', content: '', artworkId: null });
              }} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showUploadForm && (
        <div className="upload-form-container">
          <h2>{newArtwork.id ? 'Edit Artwork' : 'Upload New Artwork'}</h2>
          <form onSubmit={handleArtworkSubmit} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Artwork Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newArtwork.title}
                  onChange={handleArtworkInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Artist</label>
                <input
                  type="text"
                  name="artist"
                  value={newArtwork.artist}
                  onChange={handleArtworkInputChange}
                  placeholder="Artist name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  name="year"
                  value={newArtwork.year}
                  onChange={handleArtworkInputChange}
                  placeholder="Creation year"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={newArtwork.image}
                  onChange={handleArtworkInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newArtwork.description}
                onChange={handleArtworkInputChange}
                rows="3"
                placeholder="Brief description of the artwork..."
              />
            </div>

            <div className="form-group">
              <label>Historical Context</label>
              <textarea
                name="history"
                value={newArtwork.history}
                onChange={handleArtworkInputChange}
                rows="3"
                placeholder="Historical background and significance..."
              />
            </div>

            <div className="form-group">
              <label>Artist Biography</label>
              <textarea
                name="artistBio"
                value={newArtwork.artistBio}
                onChange={handleArtworkInputChange}
                rows="3"
                placeholder="Information about the artist..."
              />
            </div>

            <div className="form-group">
              <label>Cultural Significance</label>
              <textarea
                name="culturalSignificance"
                value={newArtwork.culturalSignificance}
                onChange={handleArtworkInputChange}
                rows="3"
                placeholder="Cultural importance and impact..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Virtual Tour URL</label>
                <input
                  type="url"
                  name="virtualTourUrl"
                  value={newArtwork.virtualTourUrl}
                  onChange={handleArtworkInputChange}
                  placeholder="https://example.com/tour"
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newArtwork.price}
                  onChange={handleArtworkInputChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newArtwork.status}
                  onChange={handleArtworkInputChange}
                >
                  <option value="available">Available for Sale</option>
                  <option value="sold">Sold</option>
                  <option value="exhibited">On Exhibition</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Upload Artwork</button>
              <button type="button" onClick={() => setShowUploadForm(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="artworks-section">
        <h2>Your Artworks</h2>
        <div className="artworks-grid">
          {artworks.map(artwork => (
            <div key={artwork.id} className="artwork-card">
              <img src={artwork.image} alt={artwork.title} />
              <div className="artwork-info">
                <h3>{artwork.title}</h3>
                <p>by {artwork.artist}</p>
                <p className="artwork-price">${artwork.price}</p>
                <p className="artwork-status">{artwork.status}</p>
                <div className="artwork-actions">
                  <button className="edit-btn" onClick={() => handleEditArtwork(artwork)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteArtwork(artwork.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="exhibitions-section">
        <h2>Your Exhibitions</h2>
        <div className="exhibitions-list">
          {exhibitions.map(exhibition => (
            <div key={exhibition.id} className="exhibition-item">
              <div className="exhibition-info">
                <h3>{exhibition.title}</h3>
                <p className="exhibition-theme">{exhibition.theme}</p>
                <p className="exhibition-dates">
                  {exhibition.startDate} - {exhibition.endDate}
                </p>
                <p className="exhibition-location">{exhibition.location}</p>
                <div className="exhibition-actions">
                  <button className="edit-btn">Edit</button>
                  <button 
                    className="manage-btn"
                    onClick={() => setSelectedExhibitionForArtworks(exhibition.id === selectedExhibitionForArtworks ? null : exhibition.id)}
                  >
                    {selectedExhibitionForArtworks === exhibition.id ? 'Hide Artworks' : 'Manage Artworks'}
                  </button>
                  <button className="delete-btn">Delete</button>
                </div>
                {selectedExhibitionForArtworks === exhibition.id && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
                    <h4>Assign Artworks to Exhibition</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {artworks.map(art => (
                        <button
                          key={art.id}
                          onClick={() => handleAssignArtworkToExhibition(exhibition.id, art.id)}
                          style={{
                            padding: '0.5rem',
                            background: (exhibition.artworks || []).includes(art.id) ? '#4CAF50' : 'white',
                            color: (exhibition.artworks || []).includes(art.id) ? 'white' : '#333',
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          {art.title} {(exhibition.artworks || []).includes(art.id) && '✓'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section">
        <h2>Curatorial Insights</h2>
        <div className="insights-grid">
          {insights.map(insight => {
            const relatedArtwork = insight.artworkId ? artworks.find(a => a.id === insight.artworkId) : null;
            return (
              <div key={insight.id} className="insight-card">
                <h3>{insight.title}</h3>
                {relatedArtwork && (
                  <p style={{ fontSize: '0.9rem', color: '#667eea', marginBottom: '0.5rem' }}>
                    Related to: {relatedArtwork.title}
                  </p>
                )}
                <p>{insight.content.length > 150 ? `${insight.content.substring(0, 150)}...` : insight.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#666' }}>{insight.date}</span>
                  <button 
                    className="read-more-btn"
                    onClick={() => {
                      const fullContent = (
                        <div>
                          <h2>{insight.title}</h2>
                          {relatedArtwork && (
                            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
                              <p><strong>Related Artwork:</strong> {relatedArtwork.title} by {relatedArtwork.artist}</p>
                            </div>
                          )}
                          <p style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{insight.content}</p>
                          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                            Published by {insight.curator || user.username} on {insight.date}
                          </p>
                        </div>
                      );
                      // You would use a modal here, but for now we'll use alert
                      alert(fullContent.props.children[0].props.children + '\n\n' + insight.content);
                    }}
                  >
                    Read More
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Curator;