import React, {useEffect, useState} from 'react';
import Card from './components/card.js';
import Tile from './components/tile.js';
import Popup from './components/add-popup.js';
import './App.css';

function App() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [appInPopupID, setPopupID] = useState(-1);

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

  const toggleEditPopup = appID => {
    console.log("opening")
    // If closing, set the ID of the app to be shown in the popup = -1
    setPopupID(appID);
    setEditPopupOpen(!editPopupOpen);
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
  const updateData = (newState, oldState, appID, newData) => {
    console.log("updating data", newData);
    removeEltFromState(oldState, appID);
    let removedList = []

    switch(newState) {
      case "Interested":
        removedList = intData.filter(item => item.id != appID)
        setIntData([...removedList, newData]);
        break;
      case "In Progress":
        removedList = progData.filter(item => item.id != appID)
        setProgData([...removedList, newData]);
        break;
      case "Applied":
        removedList = appliedData.filter(item => item.id != appID)
        setAppliedData([...removedList, newData]);
        break;
      case "Interviewing":
        removedList = interviewData.filter(item => item.id != appID)
        setInterviewData([...removedList, newData]);
        break;
    }

    // Update the database data for the updated application
    fetch('/api/v1/applications/update/' + appID, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    }).then(
        response => response.json().then(
            data => console.log("UPDATED DATA: ", data)
        )
    );
  }

  const removeEltFromState = (stateToRemoveFrom, dataToRemoveID) => {
    switch(stateToRemoveFrom) {
      case "Interested":
        setIntData(intData.filter(item => item.id != dataToRemoveID));
        break;
      case "In Progress":
        setProgData(progData.filter(item => item.id != dataToRemoveID));
        break;
      case "Applied":
        setAppliedData(appliedData.filter(item => item.id != dataToRemoveID));
        break;
      case "Interviewing":
        setInterviewData(interviewData.filter(item => item.id != dataToRemoveID));
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
      <button id='add-popup' onClick={togglePopup}>+</button>
      {
        popupOpen ? <Popup open={togglePopup} stateOptions={states} createNewApp={createNewApp}
                      updateData={updateData} prevAppObj={{'company':'', 'position':'', 'state':'Interested'}}
                      /> : null
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
                  editPopupOpen={editPopupOpen}
                  toggleEditPopup={toggleEditPopup}
                  createNewApp={createNewApp}
                  updateData={updateData}
                  appInPopupID={appInPopupID}
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
