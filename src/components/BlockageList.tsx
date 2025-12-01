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
        await loadBlockages();
      } catch (error) {
        console.error('Failed to delete blockage:', error);
        alert('Failed to delete blockage. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="blockage-list">
        <h3>Blockages</h3>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="blockage-list">
      <h3>Blockages ({blockages.length})</h3>
      {blockages.length === 0 ? (
        <div className="empty-state">No blockages found</div>
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
  );
}

