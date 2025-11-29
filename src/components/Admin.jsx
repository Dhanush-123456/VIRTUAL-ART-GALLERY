import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { artworks as initialArtworks } from '../data/artworks';
import { exhibitions as initialExhibitions } from '../data/exhibitions';

const Admin = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState(initialArtworks);
  const [exhibitions, setExhibitions] = useState(initialExhibitions);
  const [users, setUsers] = useState([
    { id: 1, username: 'john_artist', role: 'artist', email: 'john@example.com', status: 'active' },
    { id: 2, username: 'maria_curator', role: 'curator', email: 'maria@example.com', status: 'active' },
    { id: 3, username: 'visitor1', role: 'visitor', email: 'visitor1@example.com', status: 'active' }
  ]);
  const [gallerySettings, setGallerySettings] = useState({
    name: 'Virtual Art Gallery',
    description: 'A platform for displaying and managing artworks',
    maintenanceMode: false,
    allowPublicBrowsing: true,
    maxArtworkUpload: 50
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  if (!user || user.role !== 'admin') {
    return <Login onLogin={onLogin} />;
  }

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const handleDeleteArtwork = (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      setArtworks(prev => prev.filter(art => art.id !== id));
      alert('Artwork deleted successfully!');
    }
  };

  const handleDeleteExhibition = (id) => {
    if (window.confirm('Are you sure you want to delete this exhibition?')) {
      setExhibitions(prev => prev.filter(ex => ex.id !== id));
      alert('Exhibition deleted successfully!');
    }
  };

  const handleUserRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    alert(`User role updated to ${newRole}`);
  };

  const handleUserStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    alert(`User status updated to ${newStatus}`);
  };

  const handleSettingsChange = (key, value) => {
    setGallerySettings(prev => ({ ...prev, [key]: value }));
    alert('Settings updated successfully!');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.username}! Manage the platform and oversee operations.</p>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e1e5e9' }}>
        <button 
          className={activeTab === 'overview' ? 'tab-active' : 'tab-btn'}
          onClick={() => setActiveTab('overview')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'overview' ? '2px solid #667eea' : 'none' }}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'users' ? 'tab-active' : 'tab-btn'}
          onClick={() => setActiveTab('users')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'users' ? '2px solid #667eea' : 'none' }}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'content' ? 'tab-active' : 'tab-btn'}
          onClick={() => setActiveTab('content')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'content' ? '2px solid #667eea' : 'none' }}
        >
          Content Management
        </button>
        <button 
          className={activeTab === 'settings' ? 'tab-active' : 'tab-btn'}
          onClick={() => setActiveTab('settings')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'settings' ? '2px solid #667eea' : 'none' }}
        >
          Gallery Settings
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="admin-stats">
            <div className="stat-card">
              <h3>👥 Total Users</h3>
              <p className="stat-number">{users.length}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{users.filter(u => u.role === 'artist').length} Artists</p>
            </div>
            <div className="stat-card">
              <h3>🖼️ Artworks</h3>
              <p className="stat-number">{artworks.length}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{artworks.filter(a => a.status === 'available').length} Available</p>
            </div>
            <div className="stat-card">
              <h3>🏛️ Exhibitions</h3>
              <p className="stat-number">{exhibitions.length}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{exhibitions.filter(e => e.status === 'current').length} Active</p>
            </div>
            <div className="stat-card">
              <h3>💰 Revenue</h3>
              <p className="stat-number">${artworks.reduce((sum, a) => sum + (a.price || 0), 0).toLocaleString()}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Total Value</p>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">2 hours ago</span>
                <span className="activity-desc">New artwork uploaded by Artist</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">4 hours ago</span>
                <span className="activity-desc">Exhibition "Modern Visions" created</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">1 day ago</span>
                <span className="activity-desc">New user registration: 3 new visitors</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="admin-content-section">
          <h2>User Management</h2>
          <div className="users-table" style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Username</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{u.username}</td>
                    <td style={{ padding: '1rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={u.role} 
                        onChange={(e) => handleUserRoleChange(u.id, e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                      >
                        <option value="visitor">Visitor</option>
                        <option value="artist">Artist</option>
                        <option value="curator">Curator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <select 
                        value={u.status} 
                        onChange={(e) => handleUserStatusChange(u.id, e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ddd' }}
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        className="delete-btn" 
                        onClick={() => {
                          if (window.confirm('Delete this user?')) {
                            setUsers(prev => prev.filter(user => user.id !== u.id));
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="admin-content-section">
          <h2>Content Management</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3>Artworks ({artworks.length})</h3>
            <div className="artworks-grid" style={{ marginTop: '1rem' }}>
              {artworks.map(artwork => (
                <div key={artwork.id} className="artwork-card">
                  <img src={artwork.image} alt={artwork.title} />
                  <div className="artwork-info">
                    <h3>{artwork.title}</h3>
                    <p>by {artwork.artist}</p>
                    <p className="artwork-status">Status: {artwork.status}</p>
                    <div className="artwork-actions">
                      <button className="edit-btn" onClick={() => setSelectedArtwork(artwork)}>View</button>
                      <button className="delete-btn" onClick={() => handleDeleteArtwork(artwork.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Exhibitions ({exhibitions.length})</h3>
            <div className="exhibitions-list" style={{ marginTop: '1rem' }}>
              {exhibitions.map(exhibition => (
                <div key={exhibition.id} className="exhibition-item">
                  <div className="exhibition-info">
                    <h3>{exhibition.title}</h3>
                    <p className="exhibition-theme">{exhibition.theme}</p>
                    <p className="exhibition-dates">{exhibition.startDate} - {exhibition.endDate}</p>
                    <p className="exhibition-status">Status: {exhibition.status}</p>
                    <div className="exhibition-actions">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteExhibition(exhibition.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="admin-content-section">
          <h2>Gallery Settings</h2>
          <div className="settings-form" style={{ background: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Gallery Name</label>
              <input
                type="text"
                value={gallerySettings.name}
                onChange={(e) => handleSettingsChange('name', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '2px solid #e1e5e9' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Description</label>
              <textarea
                value={gallerySettings.description}
                onChange={(e) => handleSettingsChange('description', e.target.value)}
                rows="4"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '2px solid #e1e5e9' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={gallerySettings.maintenanceMode}
                  onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Maintenance Mode
              </label>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>
                <input
                  type="checkbox"
                  checked={gallerySettings.allowPublicBrowsing}
                  onChange={(e) => handleSettingsChange('allowPublicBrowsing', e.target.checked)}
                  style={{ marginRight: '0.5rem' }}
                />
                Allow Public Browsing
              </label>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Max Artwork Upload per User</label>
              <input
                type="number"
                value={gallerySettings.maxArtworkUpload}
                onChange={(e) => handleSettingsChange('maxArtworkUpload', parseInt(e.target.value))}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '5px', border: '2px solid #e1e5e9' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
