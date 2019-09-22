new p5();

const TRANSPERENCY = 75;
const BACKGROUND_COLOR = color(255, 212,86);
const COLOR_WHITE = color(255, 255, 255);
const COLOR_BLUE = color(135, 206, 235, 100);
const COLOR_GRAY = color(176, 176, 176);

const COLOR_WALL = color(0, 0, 0, TRANSPERENCY );
const COLOR_START = color(0, 255, 0, TRANSPERENCY);
const COLOR_END = color( 255, 0, 0, TRANSPERENCY);

// canvas variables
var canvas;
// const HORIZONTAL_PERCENTAGE = .99;
// const VERTICAL_PERCENTAGE = .75;

// logical grid
var logical_grid;
var logical_grid_size = [ 70, 25 ];
var current_display_node_size;

// update grid
var update_display = false;
// canvas creation and dynamic resizing

//selection update variables
var selectionQueue = new Array();

// settings value
var visualize_algorithm = false;
var current_selected_algorithm = null;
var current_selected_node_type = null;
var current_selected_visualization_speed = null;
var current_selected_start_node = null;
var current_selected_end_node = null;

// tip based on settings
var current_tip = null;

// load default resources
var start_node_asset;
var end_node_asset;




function calculateCanvasDimensions() {

    var dimensions = new Array();
    // node size based on horizontal length of browser
    current_display_node_size = Math.floor( windowWidth / logical_grid_size[0] );

    // horizontal length
    dimensions.push( current_display_node_size * logical_grid_size[0] );

    // vertical length
    dimensions.push( current_display_node_size * logical_grid_size[1] );

    return dimensions;


}
function preload() {

    // TODO: stalls time, if commented out application crashes, try using jquery to fix
    end_node_asset = loadImage('../../assets/end-node-original.png');
    start_node_asset = loadImage('../../assets/start-node-original.png');


}
function setup() {
    var canvas_dimensions = calculateCanvasDimensions();
    canvas = createCanvas(canvas_dimensions[0], canvas_dimensions[1] );
    // canvas = createCanvas( Math.floor( windowWidth * HORIZONTAL_PERCENTAGE ) , Math.floor( windowHeight * VERTICAL_PERCENTAGE )) ;
    canvas.parent( 'sketch-holder' );
    pixelDensity(1);
    stroke( COLOR_BLUE );
    // create logical grid
    createLogicalGrid();

    //set initial tip
    document.getElementById( 'tip' ).innerHTML = 'pick an algorithm to visualize' ;
    // set initial node type to start
    current_selected_node_type = 'start';
    //set initial visualization speed to fast
    current_selected_visualization_speed = 'fast';
    // display grid
    update_display = true;
}


function windowResized() {
    // resizeCanvas( Math.floor( windowWidth * HORIZONTAL_PERCENTAGE ) , Math.floor( windowHeight * VERTICAL_PERCENTAGE ));
    var canvas_dimensions = calculateCanvasDimensions();
    resizeCanvas( canvas_dimensions[0], canvas_dimensions[1] );
    //resize assets
    // resizeAssets();
    // update display
    update_display = true;
    // console.log(windowWidth);
    // console.log(windowHeight);
}

//grid creation
function createLogicalGrid() {
    /*
     0 1 2 3 4 5
    0------------>
    1------------>
    2------------>
    */
    logical_grid = new Array( logical_grid_size[1] );

    for(var i=0; i < logical_grid.length; i++)
    {
        logical_grid[i] = new Array( logical_grid_size[0] );
    }

    // populate logical grid
    for(var y=0; y < logical_grid.length; y++)
    {
        for(var x=0; x < logical_grid[y].length; x++)
        {
            logical_grid[y][x] = new Node();
        }
    }

    // set default start and end node
    current_selected_start_node = [ Math.floor( logical_grid_size[1] / 2 ), Math.floor( logical_grid_size[0] / 3 ) ];
    current_selected_end_node = [  Math.floor( logical_grid_size[1] / 2 ), Math.floor( logical_grid_size[0] * ( 2 / 3 )  ) ];
    // set node types
    logical_grid[ current_selected_start_node[0] ] [current_selected_start_node[1] ].set_node_type = 'start';
    logical_grid[ current_selected_end_node[0] ] [current_selected_end_node[1] ].set_node_type = 'end';

    // console.log(current_selected_start_node);
    // console.log(current_selected_end_node);

    console.log(logical_grid);


}

function drawGrid( grid ) {

    // var node_size = ( width / ( logical_grid_size * 3 ) );
    console.log( 'updating display' );
    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            fill( COLOR_WHITE );

            if( grid[y][x].get_node_type == 'wall' )
            {
                fill( COLOR_GRAY );
            }

            square( x*current_display_node_size, y*current_display_node_size, current_display_node_size );

            // display node type
            if( grid[y][x].get_node_type == 'start' ) {
                // display start node
                image( start_node_asset, x*current_display_node_size, y*current_display_node_size, current_display_node_size, current_display_node_size);
            } else if( grid[y][x].get_node_type == 'end' ) {
                // display end node
                image( end_node_asset, x*current_display_node_size, y*current_display_node_size, current_display_node_size, current_display_node_size);
            }

        }
    }
    update_display = false;
}
// select event listeners
// --------------------------------------------------------------------------------
// algorithms
document.getElementById( 'algorithms').addEventListener( 'change', event => {
    current_selected_algorithm = event['currentTarget']["value"];
    console.log(current_selected_algorithm);

    // generated tip based on settings
    generateTip();

});

// node-type
document.getElementById( 'node-type').addEventListener( 'change', event => {
    current_selected_node_type = event['currentTarget']["value"];
    console.log(current_selected_node_type);


});

// visualization speed
document.getElementById( 'speed').addEventListener( 'change', event => {
    current_selected_visualization_speed = event['currentTarget']["value"];
    console.log(current_selected_visualization_speed);

    // generated tip based on settings
    generateTip();
});

function generateTip() {

    // cascading logic
    var generated_tip;
    if ( current_selected_algorithm == 'not-selected'  || current_selected_algorithm == null ) {
        generated_tip = 'pick an algorithm to visualize';
    } else if ( current_selected_start_node == null ) {
        generated_tip = 'a start node must be placed'
    } else if ( current_selected_end_node == null ) {
        generated_tip = 'an end node must be placed'
    } else {
        generated_tip = 'click visualize to start visualization'
    }

    // set tip
    document.getElementById( 'tip' ).innerHTML = generated_tip;

}


// button click event listeners
// --------------------------------------------------------------------------------
// clear board button
document.getElementById( 'clear-board-button').addEventListener( 'click', event => {
    // console.log(event['currentTarget']['value']);
    // clear board
    for(var y=0; y < logical_grid.length; y++)
    {
        for(var x=0; x < logical_grid[y].length; x++)
        {
            // set node properties to default
            logical_grid[y][x].set_node_type = null;
            logical_grid[y][x].set_visited = false;
            logical_grid[y][x].set_is_path = false;
        }
    }
    // clear start node and end end node
    current_selected_start_node = null;
    current_selected_end_node = null;
    // update display
    update_display = true;
});

// clear path button
document.getElementById( 'clear-path-button' ).addEventListener( 'click', event => {
    console.log('clear path button pressed');
    // walls and weights
    for(var y=0; y < logical_grid.length; y++)
    {
        for(var x=0; x < logical_grid[y].length; x++)
        {
            // set variables used for path visualization to default
            logical_grid[y][x].set_visited = false;
            logical_grid[y][x].set_is_path = false;
        }
    }
    // update display
    update_display = true;
});

// clear walls and weights button
document.getElementById( 'clear-walls-weights-button' ).addEventListener( 'click', event => {
    console.log('clear walls and weights button pressed');
    // walls and weights
    for(var y=0; y < logical_grid.length; y++)
    {
        for(var x=0; x < logical_grid[y].length; x++)
        {
            // set node type to null if it equals 'wall'
            if( logical_grid[y][x] === 'wall_node') {
                logical_grid[y][x].set_node_type = null;
            }
            // set node weight to null
            logical_grid[y][x].set_weight = null;
        }
    }
    // update display
    update_display = true;
});

// visualize button
document.getElementById( 'visualize-button' ).addEventListener( 'click', event => {
    console.log('visualize button pressed');
    // check requirements for visualization
    // algorithm must be picked, visualization speed must best set, start and end node must be placed, weights are required depending on the alogorithm
    if( ( current_selected_algorithm != null && current_selected_algorithm != 'not-selected' ) && ( current_selected_visualization_speed != null && current_selected_visualization_speed != 'not-selected' ) && ( current_selected_start_node != null ) && ( current_selected_end_node != null ) ) {
        visualize_algorithm = true;
        // suggest adding wall nodes
        document.getElementById( 'tip' ).innerHTML = 'have you tried placing wall nodes yet?';
    } else {
        generateTip();
        console.log(' requirements for visualization were not met');
    }

});

function mousePressed() {

    var x_selected = Math.floor ( mouseX / current_display_node_size );
    var y_selected = Math.floor ( mouseY / current_display_node_size );

    // check if position selected i valid
    if( ( ( x_selected >= 0 ) && ( x_selected <= logical_grid[0].length-1 ) ) && ( ( y_selected >=0 )  && ( y_selected <= logical_grid.length - 1 ) ) ) {
        console.log( 'x: %d y:%d', x_selected, y_selected);
        selectionQueue.push( [ y_selected, x_selected ] );
        console.log(selectionQueue);
    }

}

function clearSelectionQueue() {
    while( selectionQueue.length > 0 ) {
        console.log( 'node updated');
        var current_node_position = selectionQueue.shift();
        current_node = logical_grid[ current_node_position[0] ][ current_node_position [1] ];
        // current_node.set_visited = !( current_node.get_visited );
        // if selection node equals start
        if( current_selected_node_type == 'start' ) {
            if( current_selected_start_node == null )
            {
                // update start node
                current_selected_start_node = [ current_node_position[0], current_node_position[1] ];
                // set node type
                logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_node_type = 'start';
            } else {

                // if selected node is the end node
                if( logical_grid[ current_node_position[0] ][ current_node_position[1] ].get_node_type == 'end' ) {
                    current_selected_end_node = null;
                }

                //set previous start node type to null
                logical_grid[ current_selected_start_node[0] ][ current_selected_start_node[1] ].set_node_type = null;
                // update start node
                current_selected_start_node = [ current_node_position[0], current_node_position[1] ];
                // set node type
                logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_node_type = 'start';
            }

        } else if( current_selected_node_type == 'end' ) {
            if( current_selected_end_node == null )
            {
                // update end node
                current_selected_end_node = [ current_node_position[0], current_node_position[1] ];
                // set node type
                logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_node_type = 'end';
            } else {

                // if selected node is the start node
                if( logical_grid[ current_node_position[0] ][ current_node_position[1] ].get_node_type == 'start' ) {
                    current_selected_start_node = null;
                }

                //set previous end node type to null
                logical_grid[ current_selected_end_node[0] ][ current_selected_end_node[1] ].set_node_type = null;
                // update end node
                current_selected_end_node = [ current_node_position[0], current_node_position[1] ];
                // set node type
                logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_node_type = 'end';
            }

        } else if( current_selected_node_type == 'wall' ) {
            if ( logical_grid[ current_node_position[0] ][ current_node_position[1] ].get_node_type != 'start' && logical_grid[ current_node_position[0] ][ current_node_position[1] ].get_node_type != 'end'  ) {
                // place wall node
                logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_node_type = 'wall';
            }
        }
    }
    update_display = true;
}

function draw() {
    frameRate(60);

    // clear selection queue
    if( selectionQueue.length > 0) {
        clearSelectionQueue();
    }

    // visualize algorithm
    if ( visualize_algorithm ) {
        console.log( 'visualizing algorithm');
        visualize_algorithm = false;
    }


    // update display
    if( update_display ) {
        drawGrid( logical_grid );
    }


}