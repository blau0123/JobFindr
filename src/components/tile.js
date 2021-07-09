import React from 'react';
import './tile.css';

function Tile(props) {
    const {company, position} = props.data;

    const dragStart = e => {
        const target = e.target;
        console.log(target.id)
        // Set the tile_id of the tile that is being dragged to this tile since dragging has started
        e.dataTransfer.setData('tile_id', target.id)
        
        // Use setTimeout because without, when start dragging the tile, tile becomes invis
        setTimeout(() => {
            target.style.display = 'none';
        }, 0)
    }

    const dragOver = e => {
        e.stopPropagation();
    }

    return (
        <div 
            // tile-container
            className={props.className}
            id={props.id}
            onDragStart={dragStart}
            onDragOver={dragOver}
            draggable={props.draggable}
        >
            {props.children}
        </div>
    );
}

export default Tile;