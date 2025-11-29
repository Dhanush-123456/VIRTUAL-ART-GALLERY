import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';

const Artist = ({ user, onLogin, onLogout }) => {
  if (!user || user.role !== 'artist') {
    return <Login onLogin={onLogin} />;
  }

  const [artworks, setArtworks] = useState([
    { id: 1, title: 'Sunset Painting', price: 500, status: 'available', views: 245, year: 2024, description: 'A beautiful sunset scene', culturalHistory: 'Inspired by Mediterranean sunsets' },
    { id: 2, title: 'Abstract Art', price: 300, status: 'sold', views: 180, year: 2023, description: 'Modern abstract composition', culturalHistory: 'Contemporary expressionism' }
  ]);

  const [messages, setMessages] = useState([
    { id: 1, from: 'buyer1@example.com', subject: 'Inquiry about Sunset Painting', message: 'I am interested in purchasing your artwork. Can you provide more details?', artworkId: 1, date: '2024-01-15', read: false },
    { id: 2, from: 'collector@example.com', subject: 'Abstract Art Purchase', message: 'I would like to buy your Abstract Art piece. Is it still available?', artworkId: 2, date: '2024-01-14', read: true }
  ]);

  const [sales, setSales] = useState([
    { id: 1, artworkTitle: 'Abstract Art', buyer: 'collector@example.com', price: 300, date: '2024-01-10', status: 'completed' },
    { id: 2, artworkTitle: 'Sunset Painting', buyer: 'buyer1@example.com', price: 500, date: '2024-01-12', status: 'pending' }
  ]);

  const [activeTab, setActiveTab] = useState('overview');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newArtwork, setNewArtwork] = useState({
    title: '',
    description: '',
    culturalHistory: '',
    price: '',
    year: new Date().getFullYear(),
    image: null
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArtwork(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewArtwork(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const artwork = {
      id: artworks.length + 1,
      ...newArtwork,
      status: 'available',
      views: 0,
      image: newArtwork.image ? URL.createObjectURL(newArtwork.image) : 'https://via.placeholder.com/300x200'
    };
    setArtworks(prev => [...prev, artwork]);
    setNewArtwork({ title: '', description: '', culturalHistory: '', price: '', year: new Date().getFullYear(), image: null });
    setShowUploadForm(false);
    alert('Artwork uploaded successfully!');
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

  const handleMarkMessageRead = (id) => {
    setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg));
  };

  const handleReplyMessage = (messageId, reply) => {
    alert(`Reply sent to ${messages.find(m => m.id === messageId)?.from}: ${reply}`);
    handleMarkMessageRead(messageId);
  };

  const totalSales = sales.reduce((sum, sale) => sum + (sale.status === 'completed' ? sale.price : 0), 0);
  const pendingSales = sales.filter(s => s.status === 'pending').length;
  const totalViews = artworks.reduce((sum, art) => sum + art.views, 0);
  const unreadMessages = messages.filter(m => !m.read).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Artist Dashboard</h1>
        <p>Welcome, {user.username}! Manage your portfolio and track your success.</p>
      </div>

      <div className="artist-stats">
        <div className="stat-card">
          <h3>🖼️ Total Artworks</h3>
          <p className="stat-number">{artworks.length}</p>
        </div>
        <div className="stat-card">
          <h3>💰 Total Sales</h3>
          <p className="stat-number">${totalSales.toLocaleString()}</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>{pendingSales} pending</p>
        </div>
        <div className="stat-card">
          <h3>👁️ Total Views</h3>
          <p className="stat-number">{totalViews.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>💬 Messages</h3>
          <p className="stat-number">{unreadMessages}</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Unread</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <button
          className="action-btn primary"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel Upload' : '📤 Upload New Artwork'}
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages {unreadMessages > 0 && `(${unreadMessages})`}
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => setActiveTab('sales')}
        >
          📊 Sales & Analytics
        </button>
      </div>

      {showUploadForm && (
        <div className="upload-form-container">
          <h2>{newArtwork.id ? 'Edit Artwork' : 'Upload New Artwork'}</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newArtwork.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Year Created</label>
                <input
                  type="number"
                  name="year"
                  value={newArtwork.year}
                  onChange={handleInputChange}
                  placeholder="2024"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={newArtwork.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe your artwork..."
                required
              />
            </div>

            <div className="form-group">
              <label>Cultural History & Context</label>
              <textarea
                name="culturalHistory"
                value={newArtwork.culturalHistory}
                onChange={handleInputChange}
                rows="4"
                placeholder="Provide cultural and historical context for your artwork..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={newArtwork.price}
                  onChange={handleInputChange}
                  placeholder="500"
                  required
                />
              </div>
              <div className="form-group">
                <label>Artwork Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {newArtwork.id ? 'Update Artwork' : 'Upload Artwork'}
              </button>
              <button type="button" onClick={() => {
                setShowUploadForm(false);
                setNewArtwork({ title: '', description: '', culturalHistory: '', price: '', year: new Date().getFullYear(), image: null });
              }} className="cancel-btn">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="artworks-section">
          <h2>Your Artworks</h2>
          <div className="artworks-grid">
            {artworks.map(artwork => (
              <div key={artwork.id} className="artwork-card">
                <img src={artwork.image} alt={artwork.title} />
                <div className="artwork-info">
                  <h3>{artwork.title}</h3>
                  <p className="artwork-price">${artwork.price}</p>
                  <p className="artwork-status">Status: {artwork.status}</p>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>👁️ {artwork.views} views</p>
                  {artwork.culturalHistory && (
                    <p style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', marginTop: '0.5rem' }}>
                      {artwork.culturalHistory.substring(0, 50)}...
                    </p>
                  )}
                  <div className="artwork-actions">
                    <button className="edit-btn" onClick={() => handleEditArtwork(artwork)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteArtwork(artwork.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="messages-section">
          <h2>Buyer Messages & Inquiries</h2>
          <div className="messages-list" style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                style={{ 
                  padding: '1.5rem', 
                  borderBottom: '1px solid #eee',
                  backgroundColor: !msg.read ? '#f8f9fa' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <strong>{msg.from}</strong>
                    {!msg.read && <span style={{ marginLeft: '0.5rem', background: '#667eea', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '3px', fontSize: '0.8rem' }}>New</span>}
                  </div>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>{msg.date}</span>
                </div>
                <h4 style={{ margin: '0.5rem 0', color: '#333' }}>{msg.subject}</h4>
                <p style={{ margin: '0.5rem 0', color: '#555' }}>{msg.message}</p>
                <p style={{ fontSize: '0.9rem', color: '#667eea', marginTop: '0.5rem' }}>
                  Artwork: {artworks.find(a => a.id === msg.artworkId)?.title || 'Unknown'}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="edit-btn"
                    onClick={() => {
                      const reply = prompt('Enter your reply:');
                      if (reply) handleReplyMessage(msg.id, reply);
                    }}
                  >
                    Reply
                  </button>
                  {!msg.read && (
                    <button 
                      className="action-btn secondary"
                      onClick={() => handleMarkMessageRead(msg.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="sales-section">
          <h2>Sales & Analytics</h2>
          <div className="sales-stats">
            <div className="sales-item">
              <h3>Total Earnings</h3>
              <p className="sales-amount">${totalSales.toLocaleString()}</p>
              <p className="sales-count">{sales.filter(s => s.status === 'completed').length} completed sales</p>
            </div>
            <div className="sales-item">
              <h3>Pending Sales</h3>
              <p className="sales-amount">{pendingSales}</p>
              <p className="sales-count">Awaiting payment</p>
            </div>
            <div className="sales-item">
              <h3>This Month</h3>
              <p className="sales-amount">${sales.filter(s => s.status === 'completed' && s.date.startsWith('2024-01')).reduce((sum, s) => sum + s.price, 0).toLocaleString()}</p>
              <p className="sales-count">{sales.filter(s => s.status === 'completed' && s.date.startsWith('2024-01')).length} sales</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Sales History</h3>
            <div className="sales-list" style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Artwork</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Buyer</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id} style={{ borderTop: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{sale.artworkTitle}</td>
                      <td style={{ padding: '1rem' }}>{sale.buyer}</td>
                      <td style={{ padding: '1rem' }}>${sale.price.toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>{sale.date}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          borderRadius: '15px', 
                          fontSize: '0.85rem',
                          background: sale.status === 'completed' ? '#4CAF50' : '#FF9800',
                          color: 'white'
                        }}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artist;
