import React, { useState } from "react";

import clear_icon from "./../Assets/clear.png";
import cloud_icon from "./../Assets/cloud.png";
import drizzle_icon from "./../Assets/drizzle.png";
import humidity_icon from "./../Assets/humidity.png";
import rain_icon from "./../Assets/rain.png";
import snow_icon from "./../Assets/snow.png";
import wind_icon from "./../Assets/wind.png";
import haze_icon from "./../Assets/haze.png";
import background from "./../Assets/backgrnd.jpg";

import "./WeatherDisplay.css";

export default function WeatherDisplay() {
  let api_key = "ccd5cfe259001d85c1fbdbf2609083c5";
  const [placeName, setplaceName] = useState("");
  const [location, setLocation] = useState("");
  const [windspeed, setwindspeed] = useState("");
  const [humidity, sethumidity] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [wIcon, setwIcon] = useState("");
  const [timezone, setTimezone] = useState("");
  const [feelslike, setFeellike] = useState("");
  const [temp, setTemp] = useState("");
  document.body.style.backgroundImage = `url(${background})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundAttachment = "fixed";

  function convertUnixTimestampToDateTime(timestamp, timezoneOffsetSeconds) {
    // Multiply by 1000 to convert seconds to milliseconds
    const date = new Date(timestamp * 1000);

    // Adjust for timezone offset
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const newDate = new Date(utc + timezoneOffsetSeconds * 1000);

    // Extract individual date and time components
    const hours = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    const seconds = newDate.getSeconds().toString().padStart(2, "0");

    // Format the date and time
    const formattedDateTime = `${hours}:${minutes}:${seconds}`;

    return formattedDateTime;
  }

  const updateweather = async () => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&units=Metric&appid=${api_key}`;
      let response = await fetch(url);
      let data = await response.json();

      if (data.cod && data.cod !== "404") {
        // Valid data is available
        setTemp(data.main.temp);
        setLocation(data.name);
        setwindspeed(data.wind.speed);
        sethumidity(data.main.humidity);
        setSunrise(data.sys.sunrise);
        setSunset(data.sys.sunset);
        setFeellike(data.main.feels_like);
        setTimezone(data.timezone);

        if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
          setwIcon(clear_icon);
        } else if (
          data.weather[0].icon === "03d" ||
          data.weather[0].icon === "03n"
        ) {
          setwIcon(drizzle_icon);
        } else if (
          data.weather[0].icon === "02d" ||
          data.weather[0].icon === "02n" ||
          data.weather[0].icon === "04d" ||
          data.weather[0].icon === "04n"
        ) {
          setwIcon(cloud_icon);
        } else if (
          data.weather[0].icon === "09d" ||
          data.weather[0].icon === "09n"
        ) {
          setwIcon(rain_icon);
        } else if (
          data.weather[0].icon === "50d" ||
          data.weather[0].icon === "50n"
        ) {
          setwIcon(haze_icon);
        } else if (
          data.weather[0].icon === "13d" ||
          data.weather[0].icon === "13n"
        ) {
          setwIcon(snow_icon);
        } else {
          setwIcon(rain_icon);
        }
      } else {
        // No valid data found
        alert("No data found for the specified city.");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      alert("An error occurred while fetching weather data.");
    }
  };

  return (
    <>
      <div className="frame">
        <div className="search-bar">
          <input
            type="text"
            name="place"
            placeholder="Which city`s weather do you want to know?"
            onChange={(e) => {
              setplaceName(e.target.value);
            }}
          />

          <button type="submit" onClick={updateweather}>
            Search
          </button>
        </div>
        <div className="upperdata">
          <img src={wIcon} alt="" />
          <div className="temp">
            {temp === "" ? "" : `${temp} °C`}

            <div style={{ fontSize: "22px", fontWeight: "400" }}>
              {feelslike === "" ? "" : `(Feels like ${feelslike} °C)`}
            </div>

            {location}
          </div>
        </div>
        <hr />
        <div className="lowerdata">
          <div className="wind">
            <img src={wind_icon} alt="" />
            <p>
              {windspeed === "" ? "" : `${windspeed} km/h`}
              <br />
              <strong>Wind Speed</strong>
            </p>
          </div>
          <div className="humidity">
            <img src={humidity_icon} alt="" />
            <p>
              {humidity === "" ? "" : `${humidity} %`}
              <br />
              <strong>Humidity</strong>
            </p>
          </div>
        </div>

        <div className="sundata">
          <div className="sunrise">
            <p>
              <div style={{ marginLeft: "40px" }}>
                {sunrise === ""
                  ? ""
                  : `${convertUnixTimestampToDateTime(
                      sunrise,
                      timezone
                    )} A.M. local time`}
              </div>

              <strong>🌅 Sunrise Time</strong>
            </p>
          </div>
          <div className="sunset">
            <p>
              <div style={{ marginLeft: "40px" }}>
                {sunset === ""
                  ? ""
                  : `${convertUnixTimestampToDateTime(
                      sunset,
                      timezone
                    )} P.M. local time`}
              </div>
              <strong>🌇 Sunset Time</strong>{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
