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

  // Cities and popular locations in Morocco for better search
  const moroccanCities = [
    { name: 'Casablanca', coordinates: [-7.5898, 33.5731] },
    { name: 'Rabat', coordinates: [-6.8498, 34.0209] },
    { name: 'Marrakech', coordinates: [-7.9811, 31.6295] },
    { name: 'Fès', coordinates: [-5.0003, 34.0181] },
    { name: 'Tanger', coordinates: [-5.8540, 35.7595] },
    { name: 'Agadir', coordinates: [-9.5981, 30.4278] },
    { name: 'Meknes', coordinates: [-5.5471, 33.8935] },
    { name: 'Oujda', coordinates: [-1.9086, 34.6814] },
    { name: 'Kenitra', coordinates: [-6.5802, 34.2610] },
    { name: 'Tetouan', coordinates: [-5.3684, 35.5889] },
    { name: 'Safi', coordinates: [-9.2372, 32.2994] },
    { name: 'Mohammedia', coordinates: [-7.3826, 33.6866] },
    { name: 'Khouribga', coordinates: [-6.9063, 32.8811] },
    { name: 'El Jadida', coordinates: [-8.5069, 33.2316] },
    { name: 'Beni Mellal', coordinates: [-6.3498, 32.3372] },
    { name: 'Nador', coordinates: [-2.9287, 35.1681] },
    { name: 'Taza', coordinates: [-4.0100, 34.2133] },
    { name: 'Settat', coordinates: [-7.6160, 33.0018] },
    { name: 'Larache', coordinates: [-6.1537, 35.1932] },
    { name: 'Ksar El Kebir', coordinates: [-5.9949, 35.0019] },
    { name: 'Khemisset', coordinates: [-6.0697, 33.8244] },
    { name: 'Guelmim', coordinates: [-10.0574, 28.9870] },
    { name: 'Berrechid', coordinates: [-7.5844, 33.2655] },
    { name: 'Ouarzazate', coordinates: [-6.9370, 30.9189] },
    { name: 'Tiznit', coordinates: [-9.7316, 29.7006] },
    { name: 'Errachidia', coordinates: [-4.4167, 31.9314] }
  ];

  const searchPlaces = async (query) => {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      let localSuggestions = [];

      // First, check for local Moroccan cities
      const matchingCities = moroccanCities.filter(city =>
        city.name.toLowerCase().includes(normalizedQuery) ||
        normalizedQuery.includes(city.name.toLowerCase())
      );

      localSuggestions = matchingCities.map(city => ({
        placeId: `local_${city.name.toLowerCase().replace(/\s+/g, '_')}`,
        address: `${city.name}, Maroc`,
        mainText: city.name,
        secondaryText: 'Maroc',
        coordinates: city.coordinates,
        types: ['locality', 'political'],
        isLocalSuggestion: true
      }));

      if (autocompleteService.current &&
          window.google &&
          window.google.maps &&
          window.google.maps.places) {
        // Use Google Places Autocomplete for better results
        autocompleteService.current.getPlacePredictions(
          {
            input: query + ', Maroc', // Add Morocco to improve results
            componentRestrictions: { country: 'ma' },
            types: ['(cities)', 'establishment', 'geocode', 'address'] // More inclusive types
          },
          (predictions, status) => {
            setIsLoading(false);

            let googleSuggestions = [];
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              googleSuggestions = predictions.map(prediction => ({
                placeId: prediction.place_id,
                address: prediction.description,
                mainText: prediction.structured_formatting.main_text,
                secondaryText: prediction.structured_formatting.secondary_text,
                types: prediction.types,
                isLocalSuggestion: false
              }));
            }

            // Combine local suggestions with Google suggestions, prioritizing local
            const combinedSuggestions = [...localSuggestions, ...googleSuggestions]
              .filter((suggestion, index, self) =>
                index === self.findIndex(s => s.mainText === suggestion.mainText)
              )
              .slice(0, 8); // Limit to 8 suggestions

            if (combinedSuggestions.length > 0) {
              setSuggestions(combinedSuggestions);
              setShowSuggestions(true);
            } else {
              // Fallback to geocoding if no suggestions
              fallbackGeocode(query);
            }
          }
        );
      } else {
        // If Google Places is not available, use local suggestions + geocoding
        if (localSuggestions.length > 0) {
          setSuggestions(localSuggestions);
          setShowSuggestions(true);
          setIsLoading(false);
        } else {
          console.warn('Google Places API not available, using geocoding fallback');
          fallbackGeocode(query);
        }
      }
    } catch (error) {
      console.error('Error searching places:', error);
      fallbackGeocode(query);
    }
  };

  const fallbackGeocode = async (query) => {
    try {
      // Try with Morocco suffix if not present
      const searchQuery = query.toLowerCase().includes('maroc') || query.toLowerCase().includes('morocco')
        ? query
        : `${query}, Maroc`;

      const result = await geocodeAddress(searchQuery);
      const suggestion = {
        placeId: result.placeId,
        address: result.formattedAddress,
        mainText: result.formattedAddress.split(',')[0],
        secondaryText: result.formattedAddress.split(',').slice(1).join(','),
        coordinates: result.coordinates,
        types: result.types,
        isLocalSuggestion: false
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
        toast.error('Aucun résultat trouvé pour cette adresse');
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
      } else if (suggestion.isLocalSuggestion) {
        // Use coordinates from local suggestion
        locationData = {
          coordinates: suggestion.coordinates,
          address: suggestion.address,
          placeId: suggestion.placeId,
          types: suggestion.types,
          name: suggestion.mainText
        };
      } else if (placesService.current &&
                 window.google &&
                 window.google.maps &&
                 window.google.maps.places) {
        // Get place details for coordinates from Google Places
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
            w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${disabled ? 'text-gray-500' : 'text-gray-900'}
          `}
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
