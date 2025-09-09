import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Search, X, Clock } from 'lucide-react';
import { geocodeAddress } from '../../utils/mapsClient';
import { toast } from 'react-hot-toast';

const LocationSearch = ({
  placeholder = "Enter address",
  onLocationSelect,
  value = "",
  disabled = false,
  className = "",
  icon
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }

    // Initialize Google Places services with proper checks
    const initializeGoogleServices = () => {
      if (window.google &&
          window.google.maps &&
          window.google.maps.places &&
          window.google.maps.places.AutocompleteService) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          const mapDiv = document.createElement('div');
          const map = new window.google.maps.Map(mapDiv);
          placesService.current = new window.google.maps.places.PlacesService(map);
        } catch (error) {
          console.error('Error initializing Google Places services:', error);
        }
      }
    };

    // Try to initialize immediately
    initializeGoogleServices();

    // If not available, wait for Google Maps to load
    if (!autocompleteService.current) {
      const checkGoogleMaps = setInterval(() => {
        if (window.google &&
            window.google.maps &&
            window.google.maps.places &&
            window.google.maps.places.AutocompleteService) {
          initializeGoogleServices();
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      // Clear interval after 10 seconds to prevent infinite polling
      setTimeout(() => clearInterval(checkGoogleMaps), 10000);
    }
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const saveToRecentSearches = useCallback((location) => {
    const newRecentSearches = [
      location,
      ...recentSearches.filter(item => item.address !== location.address)
    ].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  }, [recentSearches]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (newValue.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(newValue.trim().length === 0);
      return;
    }

    setIsLoading(true);
    
    // Debounce the search
    debounceRef.current = setTimeout(() => {
      searchPlaces(newValue);
    }, 300);
  };

  const searchPlaces = async (query) => {
    try {
      if (autocompleteService.current &&
          window.google &&
          window.google.maps &&
          window.google.maps.places) {
        // Use Google Places Autocomplete for better results
        autocompleteService.current.getPlacePredictions(
          {
            input: query,
            componentRestrictions: { country: 'ma' }, // Restrict to Morocco
            types: ['establishment', 'geocode']
          },
          (predictions, status) => {
            setIsLoading(false);

            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              const formattedSuggestions = predictions.map(prediction => ({
                placeId: prediction.place_id,
                address: prediction.description,
                mainText: prediction.structured_formatting.main_text,
                secondaryText: prediction.structured_formatting.secondary_text,
                types: prediction.types
              }));

              setSuggestions(formattedSuggestions);
              setShowSuggestions(true);
            } else {
              // Fallback to geocoding if autocomplete fails
              fallbackGeocode(query);
            }
          }
        );
      } else {
        // Fallback to geocoding if Places API is not available
        console.warn('Google Places API not available, using geocoding fallback');
        fallbackGeocode(query);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      fallbackGeocode(query);
    }
  };

  const fallbackGeocode = async (query) => {
    try {
      const result = await geocodeAddress(query);
      const suggestion = {
        placeId: result.placeId,
        address: result.formattedAddress,
        mainText: result.formattedAddress.split(',')[0],
        secondaryText: result.formattedAddress.split(',').slice(1).join(','),
        coordinates: result.coordinates,
        types: result.types
      };
      
      setSuggestions([suggestion]);
      setShowSuggestions(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error geocoding:', error);
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      if (query.trim().length > 2) {
        toast.error('No results found for this address');
      }
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setInputValue(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);

    try {
      let locationData;

      if (suggestion.coordinates) {
        // Already have coordinates from geocoding fallback
        locationData = {
          coordinates: suggestion.coordinates,
          address: suggestion.address,
          placeId: suggestion.placeId,
          types: suggestion.types
        };
      } else if (placesService.current &&
                 window.google &&
                 window.google.maps &&
                 window.google.maps.places) {
        // Get place details for coordinates
        await new Promise((resolve, reject) => {
          placesService.current.getDetails(
            {
              placeId: suggestion.placeId,
              fields: ['geometry', 'formatted_address', 'name', 'types']
            },
            (place, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                locationData = {
                  coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
                  address: place.formatted_address || suggestion.address,
                  placeId: suggestion.placeId,
                  types: place.types || suggestion.types,
                  name: place.name
                };
                resolve();
              } else {
                reject(new Error('Failed to get place details'));
              }
            }
          );
        });
      } else {
        // Fallback: use geocoding to get coordinates
        try {
          const geocodeResult = await geocodeAddress(suggestion.address);
          locationData = {
            coordinates: geocodeResult.coordinates,
            address: geocodeResult.formattedAddress || suggestion.address,
            placeId: suggestion.placeId,
            types: suggestion.types
          };
        } catch (geocodeError) {
          throw new Error('Failed to get location coordinates');
        }
      }

      saveToRecentSearches(locationData);
      onLocationSelect && onLocationSelect(locationData);
    } catch (error) {
      console.error('Error getting place details:', error);
      toast.error('Failed to get location details');
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    const totalItems = suggestions.length + (recentSearches.length > 0 && inputValue.trim() === '' ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const isRecent = inputValue.trim() === '' && selectedIndex < recentSearches.length;
          const item = isRecent ? recentSearches[selectedIndex] : suggestions[selectedIndex - (inputValue.trim() === '' ? recentSearches.length : 0)];
          handleSuggestionClick(item);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (inputValue.trim() === '' && recentSearches.length > 0) {
      setShowSuggestions(true);
    } else if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e) => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      if (e.currentTarget && !e.currentTarget.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const clearInput = () => {
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
    onLocationSelect && onLocationSelect(null);
  };

  const showRecentSearches = inputValue.trim() === '' && recentSearches.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon || <Search className="w-5 h-5" />}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-full
            text-gray-900 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
            ${disabled ? 'text-gray-500' : 'text-gray-900'}
          `}
          style={{
            borderRadius: '20px',
            outline: '0 !important',
            boxSizing: 'border-box',
          }}
        />

        {inputValue && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (showRecentSearches || suggestions.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {/* Recent searches */}
          {showRecentSearches && (
            <>
              <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">
                Recent searches
              </div>
              {recentSearches.map((item, index) => (
                <button
                  key={`recent-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(item)}
                  className={`
                    w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3
                    ${selectedIndex === index ? 'bg-primary bg-opacity-10' : ''}
                  `}
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {item.mainText || item.address.split(',')[0]}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {item.secondaryText || item.address}
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}

          {/* Search suggestions */}
          {suggestions.length > 0 && (
            <>
              {showRecentSearches && (
                <div className="px-4 py-2 text-sm font-medium text-gray-500 border-b border-gray-100">
                  Suggestions
                </div>
              )}
              {suggestions.map((suggestion, index) => {
                const actualIndex = showRecentSearches ? index + recentSearches.length : index;
                return (
                  <button
                    key={suggestion.placeId || index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`
                      w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3
                      ${selectedIndex === actualIndex ? 'bg-primary bg-opacity-10' : ''}
                    `}
                  >
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {suggestion.mainText}
                      </div>
                      {suggestion.secondaryText && (
                        <div className="text-sm text-gray-500 truncate">
                          {suggestion.secondaryText}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
