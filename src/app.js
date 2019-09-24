new p5();

const TRANSPERENCY = 75;
const BACKGROUND_COLOR = color(255, 212,86);
const COLOR_WHITE = color(255, 255, 255);
const COLOR_BLUE = color(135, 206, 235, 100);
const COLOR_GRAY = color(176, 176, 176);

const COLOR_WALL = color(0, 0, 0, TRANSPERENCY );
const COLOR_START = color(0, 255, 0, TRANSPERENCY);
const COLOR_END = color( 255, 0, 0, TRANSPERENCY);

const COLOR_YELLOW = color( 249, 202, 81);
const COLOR_MAIN = color( 255, 122, 122, TRANSPERENCY );
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

// settings values
var visualizing_algorithm = false;
const visualizing_step_size = 3;
var numerical_visualization_speed;
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

// multiple selection
var clear_queue = false;

var test_image;
//algorithm visualization
// var end_node_not_found = false;
var current_visited_nodes;
var current_optimal_path_nodes;



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
    // end_node_asset = loadImage('/assets/end-node-original.png');
    // start_node_asset = loadImage('/assets/start-node-original.png');
    end_node_asset = loadImage('https://emmanuelrocha001.github.io/pathfinding-visualization/assets/end-node-original.png');
    start_node_asset = loadImage('https://emmanuelrocha001.github.io/pathfinding-visualization/assets/start-node-original.png');
    // test_image = loadImage('https://emmanuelrocha001.github.io/pathfinding-visualization/assets/app-logo.png')
    // Jimp.read('https://emmanuelrocha001.github.io/pathfinding-visualization/assets/app-logo.png')
    // .then(image => {
    //     // Do stuff with the image.
    //     console.log('read image');
    //     test_image = image;
    // })
    // .catch(err => {
    //     // Handle an exception.
    // });


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

    //set path visualization variables to null
    current_visited_nodes = null;
    current_optimal_path_nodes = null;
    //set initial tip
    document.getElementById( 'tip' ).innerHTML = 'pick an algorithm to visualize' ;
    // set initial node type to start
    current_selected_node_type = 'start';
    //set initial visualization speed to fast
    current_selected_visualization_speed = 'fast';
    //set actual speed
    numerical_visualization_speed = visualizing_step_size * parseInt( document.getElementById( 'speed')[0]['value'] );
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

    // console.log(logical_grid);


}

// select event listeners
// --------------------------------------------------------------------------------
// algorithms
document.getElementById( 'algorithms').addEventListener( 'change', event => {
    current_selected_algorithm = event['currentTarget']["value"];
    // console.log(current_selected_algorithm);

    // generated tip based on settings
    generateTip();

});

// node-type
document.getElementById( 'node-type').addEventListener( 'change', event => {
    current_selected_node_type = event['currentTarget']["value"];

    // console.log(current_selected_node_type);


});

// visualization speed
document.getElementById( 'speed').addEventListener( 'change', event => {
    current_selected_visualization_speed = event['currentTarget']["value"];
    // console.log(current_selected_visualization_speed);
    numerical_visualization_speed = visualizing_step_size * parseInt( current_selected_visualization_speed );
    console.log( numerical_visualization_speed );
    // generated tip based on settings
    generateTip();
});

function generateTip() {

    // cascading logic
    var generated_tip;
    if ( current_selected_algorithm == 'not-selected'  || current_selected_algorithm == null ) {
        generated_tip = 'pick an algorithm to visualize';
    } else if ( current_selected_start_node == null ) {
        generated_tip = 'a start node must be placed';
    } else if ( current_selected_end_node == null ) {
        generated_tip = 'an end node must be placed';
    } else {
        generated_tip = 'click visualize to start visualization';
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
    if( visualizing_algorithm == false ) {

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
    }
});

// clear path button
document.getElementById( 'clear-path-button' ).addEventListener( 'click', event => {
    // console.log('clear path button pressed');
    // walls and weights
    if( visualizing_algorithm == false ) {

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
    }
});

// clear walls and weights button
document.getElementById( 'clear-walls-weights-button' ).addEventListener( 'click', event => {
    // console.log('clear walls and weights button pressed');
    // walls and weights
    if( visualizing_algorithm == false ) {
        for(var y=0; y < logical_grid.length; y++)
        {
            for(var x=0; x < logical_grid[y].length; x++)
            {
                // set node type to null if it equals 'wall'
                if( logical_grid[y][x].get_node_type == 'wall') {
                    logical_grid[y][x].set_node_type = null;
                }
                // set node weight to null
                logical_grid[y][x].set_weight = null;
            }
        }
        // update display
        update_display = true;
    }
});

// visualize button
document.getElementById( 'visualize-button' ).addEventListener( 'click', event => {
    // console.log('visualize button pressed');
    // check requirements for visualization
    // algorithm must be picked, visualization speed must best set, start and end node must be placed, weights are required depending on the alogorithm
    if( visualizing_algorithm == false ) {

        if( ( current_selected_algorithm != null && current_selected_algorithm != 'not-selected' ) && ( current_selected_visualization_speed != null && current_selected_visualization_speed != 'not-selected' ) && ( current_selected_start_node != null ) && ( current_selected_end_node != null ) ) {
            // visualize_algorithm = true;
            if ( current_selected_algorithm == 'depth-first-search')
            {
                document.getElementById( 'tip' ).innerHTML = 'visualization in progress...';
                current_visited_nodes = DFSearch( current_selected_start_node, current_selected_end_node, logical_grid );
                console.log( current_visited_nodes );
                visualizing_algorithm = true;
            }
            else {
                document.getElementById( 'tip' ).innerHTML = ( current_selected_algorithm + ' has not been implemented yet, please pick a different algorithm');
            }
            // suggest adding wall nodes
        } else {
            generateTip();
            // console.log(' requirements for visualization were not met');
        }
    }

});


function keyPressed() {
    if( keyCode === ENTER ) {
        // console.log( parseInt( document.getElementById( 'speed')[0]['value'] ) );
        // console.log( current_selected_start_node );
        // console.log( DFSearch( current_selected_start_node, current_selected_end_node, logical_grid ) );

    }
}

function mousePressed() {

    
    // if visualization is not in progress
    if ( visualizing_algorithm == false ) {

        var x_selected = Math.floor ( mouseX / current_display_node_size );
        var y_selected = Math.floor ( mouseY / current_display_node_size );

        // check if position selected i valid
        if( ( ( x_selected >= 0 ) && ( x_selected <= logical_grid[0].length-1 ) ) && ( ( y_selected >=0 )  && ( y_selected <= logical_grid.length - 1 ) ) ) {
            // console.log( 'x: %d y:%d', x_selected, y_selected);
            selectionQueue.push( [ y_selected, x_selected ] );
            //
            if ( current_selected_node_type != 'wall') {
                clear_queue = true;
            }
            // console.log(selectionQueue);
        }
    }

}

// multiple selection
function mouseDragged() {
    // console.log('hi');
    if( current_selected_node_type == 'wall' ){
        var x_selected = Math.floor ( mouseX / current_display_node_size );
        var y_selected = Math.floor ( mouseY / current_display_node_size );

        // check if position selected i valid
        if( ( ( x_selected >= 0 ) && ( x_selected <= logical_grid[0].length-1 ) ) && ( ( y_selected >=0 )  && ( y_selected <= logical_grid.length - 1 ) ) ) {
            // check if not in selection queue
            var is_not_in_queue = true;
            for(var i=0; i < selectionQueue.length; i++) {
                if( selectionQueue[i][0] == y_selected && selectionQueue[i][1] == x_selected ) {
                    is_not_in_queue = false;
                }
            }

            if ( is_not_in_queue ) {

                // set a maker to show node is being selected, don't show if start and end node is located there
                if( logical_grid[ y_selected ][ x_selected ].get_node_type != 'start' && logical_grid[ y_selected ][ x_selected ].get_node_type != 'end'  )
                {
                    logical_grid[ y_selected ][ x_selected ].set_is_being_selected = true;
                }
                // update display to show marker
                update_display = true;
                // push to queue
                selectionQueue.push( [ y_selected, x_selected ] );
            }
        }

    }

}

function mouseReleased() {
    if ( current_selected_node_type == 'wall') {
        clear_queue = true;
    }
}

function clearSelectionQueue() {
    while( selectionQueue.length > 0 ) {
        // console.log( 'node updated');
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
                
                if ( logical_grid[ current_node_position[0] ][ current_node_position[1] ].get_node_type != 'wall' )
                {
                    // place wall node
                    logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_node_type = 'wall';
                }
                else {
                    // remove wall node
                    logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_node_type = null;
                }
                // remove selection marker
                logical_grid[ current_node_position[0] ][ current_node_position[1] ].set_is_being_selected = false;
            }
        }
    }
    update_display = true;
}

function drawGrid( grid ) {

    // var node_size = ( width / ( logical_grid_size * 3 ) );
    // console.log( 'updating display' );
    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            fill( COLOR_WHITE );

            if( grid[y][x].get_is_path == true ) {

                if( grid[y][x].get_node_type != 'start' && grid[y][x].get_node_type != 'end' )
                {
                    fill( COLOR_YELLOW );
                }
            }
            
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

            // show selection marker
            if( grid[y][x].get_is_being_selected ) {
                fill( COLOR_MAIN );
                square( x*current_display_node_size, y*current_display_node_size, current_display_node_size );
            }

        }
    }
    update_display = false;
}

function draw() {
    frameRate(30);

    // clear selection queue
    if( selectionQueue.length > 0 && clear_queue == true ) {
        clear_queue = false;
        clearSelectionQueue();
    }

    // visualization
    if ( visualizing_algorithm  == true ) {

        if ( current_visited_nodes != null)
        {
            // visualizes a set of nodes based on speed 
            for(var i=0; i<numerical_visualization_speed; i++)
            {
                if( current_visited_nodes.length > 0 )
                {  
                    draw_node = current_visited_nodes.shift();
                    logical_grid[ draw_node[0] ][ draw_node[1] ].set_is_path = true;
                    update_display = true;
                } else {
                    visualizing_algorithm = false;
                    // update tip
                    document.getElementById( 'tip' ).innerHTML = 'try placing wall nodes this time';

                }
            }
        }

    }

    // update display
    if( update_display ) {
        drawGrid( logical_grid );
    }



}