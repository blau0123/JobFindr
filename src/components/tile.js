import React from 'react';
import './tile.css';

function Tile(props) {
    // Defines what to do when we start dragging a tile, including storing data about this tile
    const dragStart = e => {
        const target = e.target;
        console.log("ID of what you just picked up: ", target.id)
        // Set the tile_id of the tile that is being dragged to this tile since dragging has started
        e.dataTransfer.setData('tile_id', target.id);
        // Send the actual data for this application in the drag event (so when drop, can get the data to update)
        e.dataTransfer.setData('tile_data', JSON.stringify(props.data));
        
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