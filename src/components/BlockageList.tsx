import { useState, useEffect } from 'react';
import { routingAPI } from '../services/api';
import type { GeoJSON } from '../types';
import './BlockageList.css';

interface BlockageListProps {
  onDelete: (name: string) => void;
  refreshTrigger: number;
}

export default function BlockageList({ onDelete, refreshTrigger }: BlockageListProps) {
  const [blockages, setBlockages] = useState<Array<{ name: string; description: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    loadBlockages();
  }, [refreshTrigger]);

  const loadBlockages = async () => {
    setLoading(true);
    try {
      const geoJSON: GeoJSON = await routingAPI.getBlockages();
      if (geoJSON.features) {
        const blockageList = geoJSON.features
          .map((feature) => {
            const props = feature.properties;
            return {
              name: props?.name || 'Unnamed',
              description: props?.description || '',
            };
          })
          .filter((b) => b.name !== 'Unnamed' || b.description);
        setBlockages(blockageList);
      }
    } catch (error) {
      console.error('Failed to load blockages:', error);
      setBlockages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (window.confirm(`Are you sure you want to delete blockage "${name}"?`)) {
      try {
        await onDelete(name);
        // Don't call loadBlockages here - the refreshTrigger will handle it
        // This prevents double-loading and potential race conditions
      } catch (error) {
        // Error handling is done in App.tsx, but we can still log here
        console.error('Delete operation completed with error:', error);
        // The refreshTrigger will still update the list even if there was an error
      }
    }
  };

  if (loading) {
    return (
      <div className="blockage-list">
        <div className="blockage-list-header">
          <h3>🚧 Blockages</h3>
          <button
            className="minimize-button"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▲' : '▼'}
          </button>
        </div>
        {!isMinimized && (
          <div className="blockage-list-content">
            <div className="loading">Loading...</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`blockage-list ${isMinimized ? 'minimized' : ''}`}>
      <div className="blockage-list-header">
        <h3>🚧 Blockages ({blockages.length})</h3>
        <button
          className="minimize-button"
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? 'Expand' : 'Minimize'}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>
      {!isMinimized && (
        <div className="blockage-list-content">
          {blockages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🚫</div>
              <div>No blockages found</div>
            </div>
          ) : (
            <ul className="blockage-items">
              {blockages.map((blockage, index) => (
                <li key={index} className="blockage-item">
                  <div className="blockage-info">
                    <strong>{blockage.name}</strong>
                    {blockage.description && <div className="blockage-desc">{blockage.description}</div>}
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(blockage.name)}
                    title="Delete blockage"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

