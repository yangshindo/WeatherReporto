import React, { useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_WEATHER_QUERY } from "../graphql/Queries";
import swal from "sweetalert"

function Home() {
  const [citySearched, setCitySearched] = useState("");
  const nameRef = useRef()
  const [getWeather, { error, data }] = useLazyQuery(GET_WEATHER_QUERY, {
    variables: { name: citySearched },
  });

  if (error) return <h1> Error found</h1>;

  if (data) {
    console.log(data);
    if (!data.getCityByName) {
      swal({title: "City not found. Please try again.", text: "This page will reload shortly", icon: "info", button: null })
      setTimeout(() => {window.location = "/"}, 2750)
    }
  }

  function submitHandler(event) {
    event.preventDefault()

    setCitySearched(nameRef.current.value)
    getWeather()
  }

  return (
  <div>
  <div className="bg text-center">
  <div className="centered">
    <form onSubmit={submitHandler}>

        <p className="firstLine"> W &nbsp; E &nbsp; A &nbsp; T &nbsp; H &nbsp; E &nbsp; R </p>
        <p className="thirdLine"> R &nbsp; E &nbsp; P &nbsp; O &nbsp; R &nbsp; T &nbsp; O </p>
        <br />
        
        <p> <input ref={nameRef} className="InputStyle" placeholder="City Name" type="text"/></p>
        <button onClick={submitHandler} action="submit" type="button" className="btn btn-dark">Search</button>
        </form>
        
        <br /> 
        <p className="secondLine">Real time query GraphQL API - by João Mário</p>

    <div className="display-data">
        {data && (
          <div>
        <h3> {data.getCityByName.name}</h3>
        <br />
            <p>
              {" "}
              Temperature: {String(data.getCityByName.weather.temperature.actual)[0] + String(data.getCityByName.weather.temperature.actual)[1] + " ° C"}
            </p>
            <p>
              Description: {data.getCityByName.weather.summary.description}
            </p>
            <p>Wind Speed: {data.getCityByName.weather.wind.speed}</p>
            <p>Humidity: {data.getCityByName.weather.clouds.humidity}</p>
            </div>
        )}
      </div>
      </div>
      </div>
</div>
  );
}

export default Home;