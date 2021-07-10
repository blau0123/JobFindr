import React, { useState } from 'react';
import Tile from './tile.js';
import Popup from './popup.js';
import './card.css';

function Card(props) {
    const {size, states, statesColors, stateIndx, data, editPopupOpen, appInPopupID} = props;
    const {updateData, createNewApp, toggleEditPopup} = props;

    // Function to be called when dropping into the card
    const drop = e => {
        e.preventDefault();
        const tile_id = e.dataTransfer.getData('tile_id');
        const tile = document.getElementById(tile_id);
        tile.style.display = 'block';

        // e.target is the card/board you want to drop the tile into
        // e.target.appendChild(tile);

        // Make a POST request to update the data with its new position
        // Get the new state that the tile is in. ID of the card (e.target.id) will be card-id#
        const tileNewState = states[e.target.id.split('-')[1]];

        // Add this new dragged tile data to the card's data then update it
        const applicData = JSON.parse(e.dataTransfer.getData('tile_data'));
        const oldState = applicData.state;
        // Get the old data for tile that was just moved (was set in tile.js) and update it
        applicData.state = tileNewState;
        updateData(tileNewState, oldState, tile_id.split('-')[1], applicData);
    }

    const dragOver = e => {
        e.preventDefault();
    }

    return (
        <div 
            // card-outer
            className={props.className}
            id = {props.id}
            onDrop = {drop}
            onDragOver = {dragOver}
        >
            {
                // Render each position under their respective state as a tile
                data != null && data.length != 0 ? data.map((d, i) => 
                    <div className='non-drag-container'>
                        {
                            editPopupOpen && d.id === appInPopupID ? 
                                <Popup open={toggleEditPopup} stateOptions={states} 
                                    createNewApp={createNewApp} updateData={updateData} 
                                    prevAppObj={d} draggable='false' /> : null
                        }
                        <Tile className='tile-container' id={'tile-' + d.id} data={d} draggable='true'>
                            <div className='tile-content' onClick={() => toggleEditPopup(d.id)}>
                                <div className='tile-company' style={{backgroundColor:statesColors[stateIndx]}}>
                                    <p>{d.company}</p>
                                </div>
                                <p className='pos-text'>{d.position}</p>
                            </div>
                        </Tile>
                    </div>
                ) : null
            }
        </div>
    )
}

export default Card;