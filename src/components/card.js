import React from 'react';
import Tile from './tile.js';
import './card.css';

function Card(props) {
    const {size, data} = props;
    return (
        <div className='card-outer'>
            {
                // Render each position under their respective state as a tile
                data != null ? data.map(d => 
                    <div className='all-tile-container'>
                        <Tile data={d} />
                    </div>
                ) : null
            }
        </div>
    )
}

export default Card;