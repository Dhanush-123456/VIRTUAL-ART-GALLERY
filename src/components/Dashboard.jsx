import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Login from './Login';
import { artworks } from '../data/artworks';

const Dashboard = ({ user, onLogin, onLogout }) => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);
  const [userStats, setUserStats] = useState({
    artworksViewed: 0,
    exhibitionsVisited: 0,
    favoritesCount: 0,
    purchasesCount: 0
  });

  useEffect(() => {
    if (user) {
      // Load user activity from localStorage
      const activity = JSON.parse(localStorage.getItem(`user_activity_${user.id}`) || '[]');
      setRecentActivity(activity.slice(0, 5));

      // Calculate user stats
      const viewed = JSON.parse(localStorage.getItem(`viewed_artworks_${user.id}`) || '[]');
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      const purchases = JSON.parse(localStorage.getItem(`purchases_${user.id}`) || '[]');
      
      setUserStats({
        artworksViewed: viewed.length,
        exhibitionsVisited: 0,
        favoritesCount: favorites.length,
        purchasesCount: purchases.length
      });
    }
  }, [user]);

  if (!user) {
    return <Login onLogin={onLogin} />;
  }

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getRoleDashboardLink = () => {
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'artist':
        return '/artist';
      case 'curator':
        return '/curator';
      case 'visitor':
        return '/gallery';
      default:
        return '/gallery';
    }
  };

  const getRoleName = () => {
    switch (user.role) {
      case 'admin':
        return 'Administrator';
      case 'artist':
        return 'Artist';
      case 'curator':
        return 'Curator';
      case 'visitor':
        return 'Visitor';
      default:
        return 'User';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>My Dashboard</h1>
            <p>Welcome back, {user.fullName || user.username}! Here's your overview.</p>
          </div>
          <button className="action-btn secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '10px',
        marginBottom: '2rem',
        boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>
              {user.fullName || user.username}
            </h2>
            <p style={{ margin: '0 0 0.5rem 0', opacity: 0.9, fontSize: '1.1rem' }}>
              {getRoleName()}
            </p>
            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>
              {user.email}
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '1.5rem',
            borderRadius: '10px',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {user.role === 'admin' ? '👑' : user.role === 'artist' ? '🎨' : user.role === 'curator' ? '🏛️' : '👤'}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              {getRoleName()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <h3>🖼️ Artworks Viewed</h3>
          <p className="stat-number">{userStats.artworksViewed}</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Total views</p>
        </div>
        <div className="stat-card">
          <h3>❤️ Favorites</h3>
          <p className="stat-number">{userStats.favoritesCount}</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Saved artworks</p>
        </div>
        <div className="stat-card">
          <h3>🛒 Purchases</h3>
          <p className="stat-number">{userStats.purchasesCount}</p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Total orders</p>
        </div>
        <div className="stat-card">
          <h3>📅 Member Since</h3>
          <p className="stat-number" style={{ fontSize: '1.2rem' }}>
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Account created</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Quick Actions</h2>
        <div className="dashboard-actions" style={{ flexWrap: 'wrap' }}>
          <Link to={getRoleDashboardLink()} className="action-btn primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            {user.role === 'admin' ? '👑 Admin Panel' : 
             user.role === 'artist' ? '🎨 Artist Dashboard' : 
             user.role === 'curator' ? '🏛️ Curator Dashboard' : 
             '🖼️ Browse Gallery'}
          </Link>
          <Link to="/gallery" className="action-btn secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            🖼️ View Gallery
          </Link>
          <Link to="/artists" className="action-btn secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            👨‍🎨 Browse Artists
          </Link>
          <Link to="/exhibitions" className="action-btn secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            🏛️ Exhibitions
          </Link>
          <Link to="/about" className="action-btn secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>
            ℹ️ About Us
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Recent Activity</h2>
        <div className="recent-activity">
          {recentActivity.length > 0 ? (
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-desc">{activity.description}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '10px',
              textAlign: 'center',
              color: '#666',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
            }}>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>No recent activity</p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Start exploring the gallery to see your activity here!</p>
            </div>
          )}
        </div>
      </div>

      {/* Featured Artworks */}
      <div>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Featured Artworks</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {artworks.slice(0, 4).map(artwork => (
            <Link
              key={artwork.id}
              to="/gallery"
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div className="artwork-card" style={{
                background: 'white',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
              }}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div className="artwork-info" style={{ padding: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{artwork.title}</h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666', fontSize: '0.9rem' }}>
                    by {artwork.artist}
                  </p>
                  <p style={{ margin: 0, color: '#667eea', fontWeight: '600' }}>
                    ${artwork.price?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

