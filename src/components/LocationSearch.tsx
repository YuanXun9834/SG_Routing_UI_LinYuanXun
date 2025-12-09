import { useState, useEffect, useRef } from 'react';
import { searchLocation, geocodingResultToPoint, type GeocodingResult } from '../services/geocoding';
import type { Point } from '../types';
import './LocationSearch.css';

interface LocationSearchProps {
  value: Point;
  onChange: (point: Point) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export default function LocationSearch({
  value,
  onChange,
  placeholder = 'Search for a location...',
  label,
  disabled = false,
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        const results = await searchLocation(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectResult = (result: GeocodingResult) => {
    const point = geocodingResultToPoint(result);
    onChange(point);
    setSearchQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleSelectResult(searchResults[selectedIndex]);
        } else if (searchResults.length > 0) {
          handleSelectResult(searchResults[0]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSearchQuery('');
        break;
    }
  };

  return (
    <div className="location-search-container" ref={containerRef}>
      {label && <label>{label}</label>}
      <div className="location-search-input-wrapper">
        <input
          type="text"
          className="location-search-input"
          placeholder={value.description || placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (searchResults.length > 0) {
              setShowResults(true);
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        {isSearching && (
          <span className="location-search-spinner">🔍</span>
        )}
      </div>
      {showResults && searchResults.length > 0 && (
        <div className="location-search-results">
          {searchResults.map((result, index) => (
            <div
              key={result.place_id}
              className={`location-search-result ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelectResult(result)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="location-search-result-name">{result.display_name}</div>
              <div className="location-search-result-type">{result.type}</div>
            </div>
          ))}
        </div>
      )}
      {showResults && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
        <div className="location-search-no-results">
          No locations found
        </div>
      )}
    </div>
  );
}

