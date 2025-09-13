import React from 'react';
import { Clock, MapPin, CreditCard, Navigation, AlertTriangle } from 'lucide-react';

const RouteInfo = ({
  distance = null,
  duration = null,
  price = null,
  loading = false,
  error = null,
  showPricing = true,
  estimatedArrival = null,
  trafficWarning = false,
  className = ""
}) => {
  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-gray-600">Calculating route...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center space-x-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Route calculation failed</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!distance || !duration) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Navigation className="w-8 h-8 mx-auto mb-2" />
          <p className="text-sm">Select pickup and destination to see route info</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
         
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{distance}</div>
            <div className="text-sm text-gray-500">Distance</div>
          </div>

          {/* Duration */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{duration}</div>
            <div className="text-sm text-gray-500">Duration</div>
          </div>

          {/* Price */}
          {showPricing && price && (
            <div className="text-center md:col-span-1 col-span-2">
              <div className="flex items-center justify-center mb-2">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">{price}</div>
              <div className="text-sm text-gray-500">Estimated Price</div>
            </div>
          )}
        </div>

        {/* Additional info */}
        {(estimatedArrival || trafficWarning) && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            {estimatedArrival && (
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span>Estimated arrival: {estimatedArrival}</span>
              </div>
            )}
            
            {trafficWarning && (
              <div className="flex items-center space-x-2 text-sm text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span>Heavy traffic detected - arrival may be delayed</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price breakdown (if price is available) */}
      {showPricing && price && (
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Price breakdown</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base fare</span>
              <span className="text-gray-900">5.00 MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Distance ({distance})</span>
              <span className="text-gray-900">{((parseFloat(price.replace(/[^0-9.]/g, '')) - 5) * 0.7).toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time ({duration})</span>
              <span className="text-gray-900">{((parseFloat(price.replace(/[^0-9.]/g, '')) - 5) * 0.3).toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between font-medium text-gray-900 pt-1 border-t border-gray-200">
              <span>Total</span>
              <span>{price}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteInfo;
