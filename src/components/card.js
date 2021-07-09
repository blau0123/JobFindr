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
        console.log("in card.js: ", tile_id)
        const tile = document.getElementById(tile_id);
        tile.style.display = 'block';

        // e.target is the card/board you want to drop the tile into
        e.target.appendChild(tile);

        // Make a POST request to update the data with its new position
        const tileNewState = states[e.target.id];
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
                        <Tile className='tile-container' id={props.id + '-' + i} data={d} draggable='true'>
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