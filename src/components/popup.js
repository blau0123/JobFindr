import React, {useState} from 'react';
import './popup.css';

function Popup(props) {
    const {open, createNewApp, updateData, prevAppObj, stateOptions} = props;
    const [companyText, setCompanyText] = useState(prevAppObj.company);
    const [positionText, setPositionText] = useState(prevAppObj.position);
    const [state, setState] = useState(prevAppObj.state);
    const [showErrorMsg, setShowErrorMsg] = useState(false);

    const handleClick = e => {
        // props.open is the function that toggles whether the modal is open or not
        open(e);
    }

    const handleSubmit = e => {
        e.preventDefault();

        // Create the object representing the new app
        const newAppObj = {
            'state': state,
            'company': companyText,
            'position': positionText
        };

        // Make sure everything is filled in and not empty first
        if (companyText.replace(/\s/g, '') === '' || positionText.replace(/\s/g, '') === '') {
            toggleErrorMessage(true);
            return;
        }

        // If previous id is empty, then we are creating a new app
        if (prevAppObj.id === undefined) {
            createNewApp(newAppObj);
        }
        // Else, we are editing a previously created app (that already has an ID)
        else {
            newAppObj['id'] = prevAppObj.id;
            updateData(prevAppObj.state, newAppObj.state, prevAppObj.id, newAppObj);
        }

        // Close the popup after submit
        open(e);
    }

    const handleChange = e => {
        e.preventDefault();

        if (e.target.id == 'company-box')
            setCompanyText(e.target.value);
        else if (e.target.id == 'position-box')
            setPositionText(e.target.value);
        else if (e.target.id == 'state-box')
            setState(e.target.value);
    }

    const toggleErrorMessage = evt => {
        setShowErrorMsg(!showErrorMsg);
      }

    return(
        <div className='modal-container'>
            <div className='modal-content'>
                <span className="close-btn" onClick={handleClick}>&times;</span>
                <br />
                <h3 className='title'>Add a new application</h3>
                <div className='form'>
                    <div className='label-input'>
                        <label for='company-box'>Company *</label>
                        <input id='company-box' className='textbox' type='text' 
                            value={companyText} onChange={handleChange} /><br/>
                    </div>
                    <div className='label-input'>
                        <label for='position-box'>Position *</label>
                        <input id='position-box' className='textbox' type='text'
                            value={positionText} onChange={handleChange} />
                    </div>
                    <div className='label-input'>
                        <label for='state-box'>State *</label>
                        <select id='state-box' className='dropdown' value={state} onChange={handleChange}>
                            {
                                // Go through each state and make it an option
                                stateOptions !== null && stateOptions.length > 0 ? stateOptions.map(s => 
                                    <option value={s}>{s}</option>
                                ) : null
                            }
                        </select>
                    </div>
                    <div className='error-msg-container'>
                        {
                            showErrorMsg ? <p>Error: make sure all fields are complete</p> : null
                        }
                    </div>
                    <div className='add-btn-container'>
                        <button className='add-btn' onClick={handleSubmit}>Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Popup;