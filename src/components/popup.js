import React, {useState} from 'react';
import './popup.css';

function Popup(props) {
    const [companyText, setCompanyText] = useState('');
    const [positionText, setPositionText] = useState('');
    const [state, setState] = useState('Interested');
    const {open, createNewApp, stateOptions} = props;

    const handleClick = e => {
        // props.open is the function that toggles whether the modal is open or not
        open();
    }

    const handleSubmit = e => {
        e.preventDefault();

        // Create the object representing the new app
        const newAppObj = {
            'state': state,
            'company': companyText,
            'position': positionText
        };
        console.log(newAppObj);
        createNewApp(newAppObj);

        // Close the popup after submit
        open();
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

    return(
        <div className='modal-container'>
            <div className='modal-content'>
                <span className="close-btn" onClick={handleClick}>&times;</span>
                <br />
                <h3 className='title'>Add a new application</h3>
                <div className='form'>
                    <div className='label-input'>
                        <label for='company-box'>Company</label>
                        <input id='company-box' className='textbox' type='text' 
                            value={companyText} onChange={handleChange} /><br/>
                    </div>
                    <div className='label-input'>
                        <label for='position-box'>Position</label>
                        <input id='position-box' className='textbox' type='text'
                            value={positionText} onChange={handleChange} />
                    </div>
                    <div className='label-input'>
                        <label for='state-box'>State</label>
                        <select id='state-box' className='dropdown' value={state} onChange={handleChange}>
                            {
                                // Go through each state and make it an option
                                stateOptions !== null && stateOptions.length > 0 ? stateOptions.map(s => 
                                    <option value={s}>{s}</option>
                                ) : null
                            }
                        </select>
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