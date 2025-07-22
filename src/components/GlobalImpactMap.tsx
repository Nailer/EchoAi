import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapPin, Users, DollarSign, Heart, AlertCircle } from 'lucide-react';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers: MarkerData[];
  onMarkerClick: (marker: MarkerData) => void;
}

interface MarkerData {
  id: string;
  position: google.maps.LatLngLiteral;
  title: string;
  description: string;
  urgency: 'High' | 'Medium' | 'Low';
  fundingGoal: number;
  currentFunding: number;
  beneficiaries: number;
  image: string;
  category: 'Education' | 'Healthcare' | 'Food' | 'Shelter' | 'Emergency';
}

const mapMarkers: MarkerData[] = [
  {
    id: '1',
    position: { lat: 31.5017, lng: 34.4668 }, // Gaza
    title: 'Gaza Education Initiative',
    description: 'Supporting children\'s education in Gaza through digital learning platforms',
    urgency: 'High',
    fundingGoal: 50000,
    currentFunding: 32000,
    beneficiaries: 1200,
    image: 'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Education'
  },
  {
    id: '2',
    position: { lat: 33.5138, lng: 36.2765 }, // Damascus, Syria
    title: 'Syrian Healthcare Support',
    description: 'Providing medical supplies and healthcare services to displaced families',
    urgency: 'High',
    fundingGoal: 75000,
    currentFunding: 45000,
    beneficiaries: 2500,
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Healthcare'
  },
  {
    id: '3',
    position: { lat: 50.4501, lng: 30.5234 }, // Kyiv, Ukraine
    title: 'Ukraine Cultural Preservation',
    description: 'Preserving Ukrainian culture and supporting displaced artists',
    urgency: 'Medium',
    fundingGoal: 30000,
    currentFunding: 28000,
    beneficiaries: 800,
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Education'
  },
  {
    id: '4',
    position: { lat: 33.8869, lng: 35.5131 }, // Beirut, Lebanon
    title: 'Lebanon Food Security',
    description: 'Emergency food distribution for refugee families',
    urgency: 'High',
    fundingGoal: 40000,
    currentFunding: 15000,
    beneficiaries: 1800,
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Food'
  },
  {
    id: '5',
    position: { lat: 15.5527, lng: 48.5164 }, // Yemen
    title: 'Yemen Emergency Relief',
    description: 'Critical humanitarian aid for conflict-affected communities',
    urgency: 'High',
    fundingGoal: 100000,
    currentFunding: 25000,
    beneficiaries: 5000,
    image: 'https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Emergency'
  }
];

function Map({ center, zoom, markers, onMarkerClick }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            "elementType": "geometry",
            "stylers": [{"color": "#1f2937"}]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#1f2937"}]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9ca3af"}]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#d1d5db"}]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9ca3af"}]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{"color": "#374151"}]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#6b7280"}]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{"color": "#374151"}]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#4b5563"}]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9ca3af"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{"color": "#4b5563"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#6b7280"}]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#d1d5db"}]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{"color": "#374151"}]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#9ca3af"}]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#111827"}]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#6b7280"}]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [{"color": "#111827"}]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      markers.forEach((markerData) => {
        const marker = new window.google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: markerData.urgency === 'High' ? '#ef4444' : 
                      markerData.urgency === 'Medium' ? '#f59e0b' : '#10b981',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        marker.addListener('click', () => {
          onMarkerClick(markerData);
        });
      });
    }
  }, [map, markers, onMarkerClick]);

  return <div ref={ref} className="w-full h-full rounded-lg" />;
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
            <p className="text-gray-400">Failed to load map</p>
            <p className="text-sm text-gray-500 mt-1">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default function GlobalImpactMap() {
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleMarkerClick = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setShowDetails(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Education': return <Users className="w-4 h-4" />;
      case 'Healthcare': return <Heart className="w-4 h-4" />;
      case 'Food': return <DollarSign className="w-4 h-4" />;
      case 'Emergency': return <AlertCircle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High': return 'text-red-400 bg-red-900';
      case 'Medium': return 'text-yellow-400 bg-yellow-900';
      case 'Low': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <span>Global Impact Map</span>
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="h-96 rounded-lg overflow-hidden">
          <Wrapper 
            apiKey="YOUR_GOOGLE_MAPS_API_KEY" 
            render={render}
            libraries={['marker']}
          >
            <Map
              center={{ lat: 35.0, lng: 35.0 }}
              zoom={4}
              markers={mapMarkers}
              onMarkerClick={handleMarkerClick}
            />
          </Wrapper>
        </div>

        {/* Project Details Modal */}
        {showDetails && selectedMarker && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 rounded-lg">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">{selectedMarker.title}</h4>
                <button 
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <img 
                src={selectedMarker.image} 
                alt={selectedMarker.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              
              <p className="text-gray-300 text-sm mb-4">{selectedMarker.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(selectedMarker.category)}
                    <span className="text-gray-400 text-sm">{selectedMarker.category}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(selectedMarker.urgency)}`}>
                    {selectedMarker.urgency} Priority
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-white">
                      ${selectedMarker.currentFunding.toLocaleString()} / ${selectedMarker.fundingGoal.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(selectedMarker.currentFunding / selectedMarker.fundingGoal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Beneficiaries</span>
                  <span className="text-white font-semibold">{selectedMarker.beneficiaries.toLocaleString()} people</span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-2 rounded-lg font-semibold transition-all duration-200">
                  Donate Now
                </button>
                <button className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold transition-all duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">{mapMarkers.length}</div>
          <div className="text-xs text-gray-400">Active Projects</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            {mapMarkers.reduce((sum, marker) => sum + marker.beneficiaries, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">People Helped</div>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-white">
            ${mapMarkers.reduce((sum, marker) => sum + marker.currentFunding, 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">Funds Raised</div>
        </div>
      </div>
    </div>
  );
}