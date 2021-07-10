import React, {useEffect, useState} from 'react';
import Card from './components/card.js';
import Tile from './components/tile.js';
import Popup from './components/popup.js';
import './App.css';

function App() {
  const [popupOpen, setPopupOpen] = useState(false);

  const [intData, setIntData] = useState([]);
  const [progData, setProgData] = useState([]);
  const [appliedData, setAppliedData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const states = ['Interested', 'In Progress', 'Applied', 'Interviewing'];
  const statesColors = ['#346751', '#F05454', '#30475E', '#726A95'];

  // Make the fetch call when this component first loads
  useEffect(() => {
    setIntData([]);
    setProgData([]);
    setAppliedData([]);
    setInterviewData([]);

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

  const togglePopup = () => {
    setPopupOpen(!popupOpen);
  }

  const addDateToState = (addToState, newData) => {
    switch(addToState) {
      case "Interested":
        setIntData([...intData, newData]);
        break;
      case "In Progress":
        setProgData([...progData, newData]);
        break;
      case "Applied":
        setAppliedData([...appliedData, newData]);
        break;
      case "Interviewing":
        setInterviewData([...interviewData, newData]);
        break;
    }
  }

  // Add the newly dragged tile to the data for the state it was dragged into, and
  // remove it for the state that it was dragged from (to avoid dupes)
  const updateData = (newState, oldState, newData) => {
    removeEltFromState(oldState, newData);

    switch(newState) {
      case "Interested":
        setIntData([...intData, newData]);
        break;
      case "In Progress":
        setProgData([...progData, newData]);
        break;
      case "Applied":
        setAppliedData([...appliedData, newData]);
        break;
      case "Interviewing":
        setInterviewData([...interviewData, newData]);
        break;
    }
  }

  const removeEltFromState = (stateToRemoveFrom, dataToRemove) => {
    switch(stateToRemoveFrom) {
      case "Interested":
        setIntData(intData.filter(item => item.id != dataToRemove.id));
        break;
      case "In Progress":
        setProgData(progData.filter(item => item.id != dataToRemove.id));
        break;
      case "Applied":
        setAppliedData(appliedData.filter(item => item.id != dataToRemove.id));
        break;
      case "Interviewing":
        setInterviewData(interviewData.filter(item => item.id != dataToRemove.id));
        break;
    }
  }

  const createNewApp = newAppObj => {
    // Add new object to the state, so can update it without a refresh
    addDateToState(newAppObj.state, newAppObj);

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
      <button onClick={togglePopup}>+</button>
      {
        popupOpen ? <Popup open={togglePopup} stateOptions={states} createNewApp={createNewApp} /> : null
      }
      <div className="card-holder">
        {
          states.map((s, i) => 
            <div className='container'>
              {s}
              <div id='card' key={s}>
                <Card className='card-outer' id={'card-' + i} 
                  states={states}
                  statesColors={statesColors}
                  stateIndx={i}
                  updateData={updateData}
                  data={
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
