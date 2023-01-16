import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [position, setPosition] = useState([]);
  const [watchId, setWatchId] = useState(null);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (status && watchId === null) {
      let id = navigator.geolocation.watchPosition(
        async (position) => {
          try {
            const data = {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            };
            const response = await fetch(
              "http://localhost:8000/location/add-location",
              {
                method: "POST",
                body: JSON.stringify(data),
              }
            ).then((res) => {
              console.log(res.json());
            });

            console.log("data - ", data);
          } catch (error) {
            console.error("Error - ", error);
          }

          setPosition({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            timestamp: position.coords.timestamp,
            speed: position.coords.speed,
          });
        },
        (error) => {
          console.error("Error - ", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      );
      // const response = await fetch('')
      setWatchId(id);
    } else if (watchId !== null && !status) {
      console.log(watchId);
      console.log("data- ", position);
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId, status]);

  // const handleStatus = () => {
  //   navigator.geolocation.clearWatch(watchId);
  // };

  const handleStatus = () => {
    setStatus(!status);
  };

  return (
    <div className="App">
      <div className="status">
        <button onClick={handleStatus}>{status ? "Stop" : "Start"}</button>
      </div>
      {/* {position.latitude} */}
    </div>
  );
}

export default App;
