import { useEffect, useState } from "react";

export default function Main() {
  const key = process.env.WEATHER_KEY;
  const [city, setCity] = useState("New York");
  const [inputField, setInputField] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getLocationData() {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${key}`,
      );

      const data = await res.json();
      setLat(data[0].lat);
      setLon(data[0].lon);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (city) getLocationData();
  }, [getLocationData]);

  useEffect(() => {
    async function getWeatherData() {
      try {
        const res = await fetch(
          `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=imperial`,
        );
        const data = await res.json();

        setWeather(data.list);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    if (lat !== "" && lon !== "") {
      getWeatherData();
    }
  }, [lat, lon]);

  if (loading) {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  return (
    <main className="main">
      <div>
        <label>
          City Name:
          <input
            value={inputField}
            onChange={(e) => setInputField(e.target.value)}
            placeholder="City"
            type="text"
            name="city"
            id="city"
          />
        </label>
        <button
          onClick={() => {
            setCity(inputField);
            getLocationData();
          }}
        >
          Search
        </button>
      </div>
      <ul>
        {weather.map((hour) => (
          <li key={hour.dt_txt}>
            <h2>{hour.dt_txt}</h2>
            <p>
              <strong>Temp: </strong>
              {hour.main.temp}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
