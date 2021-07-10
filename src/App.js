import React, {useEffect, useState} from 'react';
import Card from './components/card.js';
import Tile from './components/tile.js';
import Popup from './components/popup.js';
import './App.css';

function App() {
  const [newState, setNewState] = useState('Interested');
  const [newCompany, setNewCompany] = useState('Facebook');
  const [newPosition, setNewPosition] = useState('Fucker');

  const [intData, setIntData] = useState([]);
  const [progData, setProgData] = useState([]);
  const [appliedData, setAppliedData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const states = ['Interested', 'In Progress', 'Applied', 'Interviewing']

  // Make the fetch call when this component first loads
  useEffect(() => {
    fetch("/api/v1/applications/all").then(
      response => response.json().then(
        // data => console.log(data)
        data => {
          // Organize the data into the different states
          console.log(data)
          data.forEach(d => {
            if (d.state == states[0])
              setIntData(oldData => [...oldData, d])
            else if (d.state == states[1])
              setProgData(oldData => [...oldData, d])
            else if (d.state == states[2])
              setAppliedData(oldData => [...oldData, d])
            else if (d.state == states[3])
              setInterviewData(oldData => [...oldData, d])
          }); 
        }))
  }, []);

  const createNewApp = () => {
    // Should open a popup so that the user can input data

    // Create the object representing the new app
    const newAppObj = {
      'state': newState,
      'company': newCompany,
      'position': newPosition
    };

    // Create the new application in the database
    fetch('/api/v1/applications/create', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAppObj)
    })
  }

  return (
    <div className="App">
      <button onClick={createNewApp}>+</button>
      <div className="card-holder">
        {
          states.map((s, i) => 
            <div className='container'>
              {s}
              <div id='card' key={s}>
                <Card className='card-outer' id={'card-' + i} data={
                  s == 'Interested' && intData.length != 0 ? intData : 
                  s == 'In Progress' && progData.length != 0 ? progData :
                  s == 'Applied' && appliedData.length != 0 ? appliedData :
                  s == 'Interviewing' && interviewData.length != 0 ? interviewData :
                  null
                } />
              </div> 
            </div> 
          )
        }
      </div>
    </div>
  );
}

export default App;
