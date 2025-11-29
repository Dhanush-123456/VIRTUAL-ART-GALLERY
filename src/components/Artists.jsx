import React, { useState } from 'react';
import { artists } from '../data/artists';
import { artworks } from '../data/artworks';

const Artists = () => {
  const [selectedArtist, setSelectedArtist] = useState(null);

  const getArtistArtworks = (artistName) => {
    return artworks.filter(artwork => artwork.artist === artistName);
  };

  const ArtistCard = ({ artist }) => (
    <div className="artist-card" onClick={() => setSelectedArtist(artist)}>
      <div className="artist-image">
        <img src={artist.profileImage} alt={artist.name} />
      </div>
      <div className="artist-info">
        <h3>{artist.name}</h3>
        <p className="artist-period">{artist.nationality} • {artist.period}</p>
        <p className="artist-style">{artist.style}</p>
        <div className="artist-stats">
          <span>{artworks.filter(art => art.artist === artist.name).length} Works</span>
          <span>{artist.birthYear} - {artist.deathYear || 'Present'}</span>
        </div>
      </div>
    </div>
  );

  const ArtistDetail = ({ artist }) => {
    const artistArtworks = getArtistArtworks(artist.name);

    return (
      <div className="artist-detail-modal">
        <div className="artist-detail-content">
          <button className="close-detail" onClick={() => setSelectedArtist(null)}>×</button>

          <div className="artist-header">
            <img src={artist.profileImage} alt={artist.name} className="artist-detail-image" />
            <div className="artist-detail-info">
              <h1>{artist.name}</h1>
              <p className="artist-lifespan">{artist.birthYear} - {artist.deathYear || 'Present'}</p>
              <p className="artist-nationality">{artist.nationality}</p>
              <p className="artist-style">{artist.style} • {artist.period}</p>
            </div>
          </div>

          <div className="artist-biography">
            <h2>Biography</h2>
            <p>{artist.biography}</p>
          </div>

          <div className="artist-achievements">
            <h2>Notable Achievements</h2>
            <ul>
              {artist.notableAchievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>

          {artistArtworks.length > 0 && (
            <div className="artist-artworks">
              <h2>Famous Works</h2>
              <div className="artwork-grid">
                {artistArtworks.map(artwork => (
                  <div key={artwork.id} className="artwork-item">
                    <img src={artwork.image} alt={artwork.title} />
                    <h4>{artwork.title}</h4>
                    <p>{artwork.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="artists-page">
      <div className="page-header">
        <h1>Our Artists</h1>
        <p>Discover the creative minds behind our extraordinary collection</p>
      </div>

      <div className="artists-grid">
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>

      {selectedArtist && <ArtistDetail artist={selectedArtist} />}
    </div>
  );
};

export default Artists;