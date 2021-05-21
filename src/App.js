import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettystats } from "./utils";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [casesType, setCasesType] = useState("cases");
  const [tableData, setTableData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 34.8046, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  const onCountryChange = async (e) => {
    const countrCode = e.target.value;
    setCountry(countrCode);

    const url =
      countrCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countrCode}`;

    await fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((contry) => ({
            name: contry.country,
            value: contry.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        })
        .catch((error) => console.log(error));
    };
    getCountries();
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, ind) => (
                <MenuItem key={ind} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active = {casesType === 'cases'}
            onClick={(e) => setCasesType("cases")}
            title="Confirmed"
            cases={prettystats(countryInfo.todayCases)}
            total={prettystats(countryInfo.cases)}
          />
          <InfoBox
            active = {casesType === 'recovered'}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettystats(countryInfo.todayRecovered)}
            total={prettystats(countryInfo.recovered)}
          />
          <InfoBox
            isBlack
            active = {casesType === 'deaths'}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettystats(countryInfo.todayDeaths)}
            total={prettystats(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h2>Live cases by Countries</h2>
            <Table countries={tableData} />
            <h2 className='graphTitle'>Worldwide new {casesType}</h2>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
