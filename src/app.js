new p5();

const BACKGROUND_COLOR = color(255, 212,86);
const COLOR_WHITE = color(255, 255, 255);
const COLOR_BLUE = color(135, 206, 235, 100);
const COLOR_GRAY = color(176, 176, 176);


// canvas variables
var canvas;
// const HORIZONTAL_PERCENTAGE = .99;
// const VERTICAL_PERCENTAGE = .75;

// logical grid
var logical_grid;
var logical_grid_size = [ 65, 25 ];
var current_display_node_size;

// update grid
var update_display = false;
// canvas creation and dynamic resizing

//selection update variables
var selectionQueue = new Array();



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
function setup() {

    var canvas_dimensions = calculateCanvasDimensions();
    canvas = createCanvas(canvas_dimensions[0], canvas_dimensions[1] );
    // canvas = createCanvas( Math.floor( windowWidth * HORIZONTAL_PERCENTAGE ) , Math.floor( windowHeight * VERTICAL_PERCENTAGE )) ;
    canvas.parent( 'sketch-holder' );
    pixelDensity(1);
    stroke( COLOR_BLUE );

    // create logical grid
    createLogicalGrid();
}


function windowResized() {
    // resizeCanvas( Math.floor( windowWidth * HORIZONTAL_PERCENTAGE ) , Math.floor( windowHeight * VERTICAL_PERCENTAGE ));
    var canvas_dimensions = calculateCanvasDimensions();
    resizeCanvas( canvas_dimensions[0], canvas_dimensions[1] );
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
    console.log(logical_grid);

    // display grid
    update_display = true;

}

function drawGrid( grid ) {

    // var node_size = ( width / ( logical_grid_size * 3 ) );
    console.log( 'updating display' );
    for(var y=0; y < grid.length; y++)
    {
        for(var x=0; x < grid[y].length; x++)
        {
            fill( COLOR_WHITE );
            if( grid[y][x].get_visited == true )
            {
                fill( COLOR_GRAY );
            }
            square( x*current_display_node_size, y*current_display_node_size, current_display_node_size );
        }
    }
    update_display = false;
}

//check for clear board button
document.getElementById( 'clear-board-button').addEventListener( 'click', event => {
    console.log(event);
    // clear board
    for(var y=0; y < logical_grid.length; y++)
    {
        for(var x=0; x < logical_grid[y].length; x++)
        {
            var current_node = logical_grid[y][x];
            // set node properties to default
            current_node.set_node_type = null;
            current_node.set_visited = false;
            current_node.set_is_path = false;

        }
    }
    // update display
    update_display = true;

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
        current_node.set_visited = !( current_node.get_visited );
    }

    update_display = true;
}

function draw() {
    frameRate(60);

    // clear selection queue
    if( selectionQueue.length > 0) {
        clearSelectionQueue();
    }

    // update display
    if( update_display ) {
        drawGrid( logical_grid );
    }


}