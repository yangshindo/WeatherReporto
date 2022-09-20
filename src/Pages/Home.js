import React, { useState, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_WEATHER_QUERY } from "../graphql/Queries";
import swal from "sweetalert"
import axios from "axios";

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


  function geolocationHandler() {
    navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client?latitude='+latitude+'&longitude='+longitude+'&localityLanguage=en')
    .then(function (response) {
      const normalizedResponse = response.data.city.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      setCitySearched(normalizedResponse)
      getWeather()
})


    })

  }


  return (
  <div>
  <div className="bg text-center">
  <div className="centered">
    <form onSubmit={submitHandler}>
      
        <p className="firstLine"> W &nbsp; E &nbsp; A &nbsp; T &nbsp; H &nbsp; E &nbsp; R </p>
        <p className="thirdLine"> R &nbsp; E &nbsp; P &nbsp; O &nbsp; R &nbsp; T &nbsp; O </p>
        <br />
       
        <p>Search by city name</p>
        <p> <input ref={nameRef} className="InputStyle" type="text"/></p>
        <button onClick={submitHandler} action="submit" type="button" className="btn btn-dark">Search</button>
        <br />

        </form>
        <br />
        <p className="secondLine">GraphQL Weather Query - by João Mário</p>

    <div className="display-data">
        {data && (
          <div>
        <h3> {data.getCityByName.name}</h3>
        <br />
            <p>
              {" "}
              Temperature: {(String (data.getCityByName.weather.temperature.actual -273.15)[0] + String (data.getCityByName.weather.temperature.actual -273.15)[1]) + "°C"} 
            </p>
            <p>
              Description: {data.getCityByName.weather.summary.description}
            </p>
            <p>Humidity: {data.getCityByName.weather.clouds.humidity} %</p>
            </div>
        )}
      </div>
      </div>
      </div>
</div>
  );
}

export default Home;