import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import EarthquakeFilter from "./components/EarthquakeFilter";
import EarthquakeDetails from "./components/EarthquakeDetails";
import MapComponent from "./components/MapComponent";
import Graph from "./components/EarthquakeGraphAnalysis";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minMagnitude, setMinMagnitude] = useState(0);
  const [dateRange, setDateRange] = useState("all_day");
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
  const [mapView, setMapView] = useState("world");

  useEffect(() => {
    const fetchEarthquakes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${dateRange}.geojson`
        );
        setEarthquakes(response.data.features);
        setFilteredEarthquakes(response.data.features);
      } catch (error) {
        console.error("Error fetching earthquake data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarthquakes();
  }, [dateRange]);

  console.log("Earthquakes:", earthquakes);

  useEffect(() => {
    setFilteredEarthquakes(
      earthquakes.filter((eq) => eq.properties.mag >= minMagnitude)
    );
  }, [minMagnitude, earthquakes]);

  const handleSearch = async () => {
    if (searchLocation) {
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${searchLocation}&format=json`
      );
      const location = geocodeResponse.data[0];
      if (location) {
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        setFilteredEarthquakes(
          earthquakes.filter(
            (eq) =>
              Math.abs(eq.geometry.coordinates[1] - lat) < 5 &&
              Math.abs(eq.geometry.coordinates[0] - lon) < 5
          )
        );
      }
    }
  };

  const handleMarkerClick = (earthquake) => setSelectedEarthquake(earthquake);
  const closeDetails = () => setSelectedEarthquake(null);

  return (
    <div className="App flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <Header />
      <EarthquakeFilter
        setMinMagnitude={setMinMagnitude}
        setDateRange={setDateRange}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        handleSearch={handleSearch}
        mapView={mapView}
        setMapView={setMapView}
      />
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="text-gray-600 text-lg ml-4">
            Loading earthquake data...
          </div>
        </div>
      ) : (
        <MapContainer
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom={true}
          className="h-[75vh] w-full rounded-lg shadow-lg border border-gray-300"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapComponent
            earthquakes={filteredEarthquakes}
            mapView={mapView}
            handleMarkerClick={handleMarkerClick}
          />
        </MapContainer>
      )}
      {selectedEarthquake && (
        <EarthquakeDetails
          selectedEarthquake={selectedEarthquake}
          closeDetails={closeDetails}
        />
      )}
      <Graph
        data={filteredEarthquakes.map((eq) => ({
          location: eq.properties["place"],
          magnitude: eq.properties["mag"],
          time: eq.properties["time"],
        }))}
      />
      <Footer />
    </div>
  );
};

export default App;
