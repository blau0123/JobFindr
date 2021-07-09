import React from 'react';
import './tile.css';

function Tile(props) {
    const {company, position} = props.data;
    return (
        <div className='tile-container'>
            <div className='tile-content'>
                <h3>{company}</h3>
                <p className='pos-text'>{position}</p>
            </div>
        </div>
    );
}

export default Tile;