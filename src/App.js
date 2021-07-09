import React, {useEffect, useState} from 'react';
import Card from './components/card.js';
import Tile from './components/tile.js';
import './App.css';

function App() {
  const [intData, setIntData] = useState(null);
  const states = ['Interested', 'In Progress', 'Applied', 'Interviewing']

  // Make the fetch call when this component first loads
  useEffect(() => {
    fetch("/api/v1/applications/interested").then(
      response => response.json().then(
        // data => console.log(data)
        data => setIntData(data)
      ))
  });

  return (
    <div className="App">
      <div className="card-holder">
        {
          states.map(s => 
            <div className='container'>
              {s}
              <div id='card' key={s}>
                <Card data={
                  s == 'Interested' ? intData : null
                }/>
              </div> 
            </div> 
          )
          /*
          appsData != null ? appsData.map(data => 
            <div id="card" key={data.id}>
              <Card content={
                <Tile company={data.company} position = {data.position} />
              } />
            </div>
          ) : null
          */
        }
      </div>
    </div>
  );
}

export default App;
