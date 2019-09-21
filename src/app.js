new p5();

const BACKGROUND_COLOR = color(255, 212,86);
const COLOR_WHITE = color(255, 255, 255);
const COLOR_BLUE = color(135, 206, 235, 100);



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

function keyPressed() {
    if( keyCode === ENTER ) {
        console.log( document.getElementById( 'sketch-holder' ).innerHTML );
    }
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
            square( x*current_display_node_size, y*current_display_node_size, current_display_node_size );
        }
    }
    update_display = false;
}

function draw() {
    frameRate(60);

    if( update_display ) {
        drawGrid( logical_grid );
    }
}