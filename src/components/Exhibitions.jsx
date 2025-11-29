import React, { useEffect, useState } from 'react';
import { exhibitions } from '../data/exhibitions';
import { artists } from '../data/artists';
import { artworks } from '../data/artworks';

const Exhibitions = () => {
  const [selectedExhibition, setSelectedExhibition] = useState(null);
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    const s = (status || '').toString().toLowerCase();
    switch (s) {
      case 'current': return '#4CAF50';
      case 'upcoming': return '#FF9800';
      case 'past': return '#9E9E9E';
      default: return '#666';
    }
  };

  const filteredExhibitions = filter === 'all'
    ? exhibitions
    : exhibitions.filter(ex => (ex.status || '').toString().toLowerCase() === filter);

  const getArtistName = (artistId) => {
    const artist = artists.find(a => a.id === artistId);
    return artist ? artist.name : 'Unknown Artist';
  };

  const getArtworkTitle = (artworkId) => {
    const artwork = artworks.find(a => a.id === artworkId);
    return artwork ? artwork.title : 'Unknown Artwork';
  };

  const formatDate = (d) => {
    try {
      const date = new Date(d);
      if (isNaN(date)) return 'TBA';
      return date.toLocaleDateString();
    } catch {
      return 'TBA';
    }
  };

  const ExhibitionCard = ({ exhibition }) => {
    const statusLabel = (exhibition.status || '').toString().charAt(0).toUpperCase() + (exhibition.status || '').toString().slice(1) || 'Unknown';
    const shortDesc = exhibition.description ? `${exhibition.description.substring(0, 100)}${exhibition.description.length > 100 ? '...' : ''}` : '';

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedExhibition(exhibition);
      }
    };

    return (
      <div
        className="exhibition-card"
        onClick={() => setSelectedExhibition(exhibition)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-pressed={selectedExhibition && selectedExhibition.id === exhibition.id}
      >
        <div className="exhibition-image">
          {exhibition.images && exhibition.images.length > 0 ? (
            <img src={exhibition.images[0]} alt={exhibition.title || 'Exhibition'} />
          ) : (
            <div className="placeholder-image">
              <span>Exhibition Image</span>
            </div>
          )}
          <div
            className="exhibition-status"
            style={{ backgroundColor: getStatusColor(exhibition.status) }}
            aria-label={`Status: ${statusLabel}`}
          >
            {statusLabel}
          </div>
        </div>
        <div className="exhibition-info">
          <h3>{exhibition.title || 'Untitled Exhibition'}</h3>
          <p className="exhibition-dates">
            {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
          </p>
          <p className="exhibition-curator">Curated by {exhibition.curator || '—'}</p>
          <p className="exhibition-description">{shortDesc}</p>
          <div className="exhibition-price">{typeof exhibition.ticketPrice !== 'undefined' ? `$${exhibition.ticketPrice}` : 'Free / TBA'}</div>
        </div>
      </div>
    );
  };

  const ExhibitionDetail = ({ exhibition }) => {
    useEffect(() => {
      const onKey = (e) => {
        if (e.key === 'Escape') setSelectedExhibition(null);
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [exhibition]);

    const statusLabel = (exhibition.status || '').toString().charAt(0).toUpperCase() + (exhibition.status || '').toString().slice(1) || 'Unknown';
    const highlights = Array.isArray(exhibition.highlights) ? exhibition.highlights : [];

    const onOverlayClick = () => setSelectedExhibition(null);
    const onContentClick = (e) => e.stopPropagation();

    return (
      <div
        className="exhibition-detail-modal"
        onClick={onOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-label={`${exhibition.title || 'Exhibition'} details`}
      >
        <div className="exhibition-detail-content" onClick={onContentClick}>
          <button
            className="close-detail"
            onClick={() => setSelectedExhibition(null)}
            aria-label="Close details"
          >
            ×
          </button>

          <div className="exhibition-header">
            <h1>{exhibition.title || 'Untitled Exhibition'}</h1>
            <div className="exhibition-meta">
              <span className="status-badge" style={{ backgroundColor: getStatusColor(exhibition.status) }}>
                {statusLabel}
              </span>
              <span className="dates">
                {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
              </span>
            </div>
          </div>

          <div className="exhibition-gallery">
            {Array.isArray(exhibition.images) && exhibition.images.length > 0 ? (
              exhibition.images.map((image, index) => (
                <img key={index} src={image} alt={`${exhibition.title || 'Exhibition'} ${index + 1}`} />
              ))
            ) : (
              <div className="placeholder-gallery">No images available</div>
            )}
          </div>

          <div className="exhibition-details">
            <div className="detail-section">
              <h2>About the Exhibition</h2>
              <p>{exhibition.description || 'Description not available.'}</p>
            </div>

            <div className="detail-section">
              <h2>Curator</h2>
              <p>{exhibition.curator || '—'}</p>
            </div>

            <div className="detail-section">
              <h2>Theme</h2>
              <p>{exhibition.theme || '—'}</p>
            </div>

            <div className="detail-section">
              <h2>Location</h2>
              <p>{exhibition.location || '—'}</p>
            </div>

            <div className="detail-section">
              <h2>Ticket Price</h2>
              <p>{typeof exhibition.ticketPrice !== 'undefined' ? `$${exhibition.ticketPrice}` : 'Free / TBA'}</p>
            </div>

            {Array.isArray(exhibition.featuredArtists) && exhibition.featuredArtists.length > 0 && (
              <div className="detail-section">
                <h2>Featured Artists</h2>
                <div className="artists-list">
                  {exhibition.featuredArtists.map(artistId => (
                    <span key={artistId} className="artist-tag">{getArtistName(artistId)}</span>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(exhibition.featuredArtworks) && exhibition.featuredArtworks.length > 0 && (
              <div className="detail-section">
                <h2>Featured Artworks</h2>
                <div className="artworks-list">
                  {exhibition.featuredArtworks.map(artworkId => (
                    <span key={artworkId} className="artwork-tag">{getArtworkTitle(artworkId)}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="detail-section">
              <h2>Highlights</h2>
              {highlights.length > 0 ? (
                <ul>
                  {highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              ) : (
                <p>No highlights available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="exhibitions-page">
      <div className="page-header">
        <h1>Exhibitions</h1>
        <p>Explore our current, upcoming, and past exhibitions</p>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Exhibitions
        </button>
        <button
          className={filter === 'current' ? 'active' : ''}
          onClick={() => setFilter('current')}
        >
          Current
        </button>
        <button
          className={filter === 'upcoming' ? 'active' : ''}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={filter === 'past' ? 'active' : ''}
          onClick={() => setFilter('past')}
        >
          Past
        </button>
      </div>

      <div className="exhibitions-grid">
        {filteredExhibitions.map(exhibition => (
          <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
        ))}
      </div>

      {selectedExhibition && <ExhibitionDetail exhibition={selectedExhibition} />}
    </div>
  );
};

export default Exhibitions;