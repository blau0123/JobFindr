import React from 'react';
import Tile from './tile.js';
import './card.css';

function Card(props) {
    const {size, data} = props;
    const states = ['Interested', 'In Progress', 'Applied', 'Interviewing'];

    // Function to be called when dropping into the card
    const drop = e => {
        e.preventDefault();
        const tile_id = e.dataTransfer.getData('tile_id');
        const tile = document.getElementById(tile_id);
        tile.style.display = 'block';

        // e.target is the card/board you want to drop the tile into
        e.target.appendChild(tile);

        // Make a POST request to update the data with its new position
        // Get the new state that the tile is in. ID of the card (e.target.id) will be card-id#
        const tileNewState = states[e.target.id.split('-')[1]];
        // Get the old data for tile that was just moved (was set in tile.js) and update it
        const applicData = JSON.parse(e.dataTransfer.getData('tile_data'));
        applicData.state = tileNewState;

        fetch('/api/v1/applications/update/' + tile_id.split('-')[1], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicData)
        }).then(
            response => response.json().then(
                data => console.log(data)
            )
        );
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
                    //<div className='all-tile-container'>
                        <Tile className='tile-container' id={'tile-' + d.id} data={d} draggable='true'>
                            <div className='tile-content'>
                                <h3>{d.company}</h3>
                                <p className='pos-text'>{d.position}</p>
                            </div>
                        </Tile>
                    //</div>
                ) : null
            }
        </div>
    )
}

export default Card;