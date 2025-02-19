import React, { useState, useEffect } from "react";
import { Card, CardContent, Input } from "@mui/joy";
import axios from "axios";
import _ from "lodash";

import Footer from "./Components/Footer";
import Topbar from "./Components/Topbar";
import ControlCard from "./Components/ControlCard";

function App() {
  const titleArray = ["banking", "logistic", "e-commerce", "computer"];
  const [searchTerm, setSearchTerm] = useState("");
  const [starWarPeople, setStarWarPeople] = useState([]);

  useEffect(() => {
    axios
      .get("https://swapi.dev/api/people/")
      .then((res) => {
        setStarWarPeople(res?.data?.results);
        console.log("People ", res?.data?.results);
      })
      .catch((error) => {
        console.error("Error", error?.message);
      });

    return () => {};
  }, []);

  return (
    <div>
      <Topbar appTitle='IARC Devboard' />{" "}
      <div className='container'>
        <Card>
          <CardContent>
            <div>Search Box</div>
            <Input
              placeholder='Input Some Search Word'
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
              You Search <span className='text-blue-500'>{searchTerm}</span>
            </div>
          </CardContent>
        </Card>

        <div className='text-xl mx-4 my-2'>People in Starwar</div>
        <div className='mx-4'>
          {_.map(starWarPeople, (eachPeople, index) => (
            <Card key={index} className='my-2'>
              <CardContent>
                <div className='flex'>
                  <div className='w-1/3'></div>
                  <div className='w-2/3'>
                    <li>Name: {eachPeople?.name}</li>
                    <li>Height: {eachPeople?.height}</li>
                    <li>Mass: {eachPeople?.mass}</li>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {titleArray.map((titleElement) => (
          <ControlCard title={titleElement} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default App;