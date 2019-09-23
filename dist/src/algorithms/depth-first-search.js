var dfs_not_found_end_node;
var dfs_visited_nodes;
// Depth first search implementation
function DFSearch( start_node, end_node, grid ) {

  // if ( start_node != null) {
  //     // mark all nodes as not visited
  for(var y=0; y < grid.length; y++)
  {
      for(var x=0; x < grid[y].length; x++)
      {
          // set variables used for path visualization to default
          grid[y][x].set_visited = false;
          grid[y][x].set_is_path = false;
      }
  }
  
  // keep track of nodes visited in order to visualize algorithm
  dfs_visited_nodes = new Array();
  // use to break out of recursion when end node found
  dfs_not_found_end_node = true;
  DFSUtil( start_node, grid );
  // console.log( dfs_visited_nodes );
  // return visited nodes array
  return dfs_visited_nodes;
}

function DFSUtil( current_node, grid ) {

  if( dfs_not_found_end_node ) {
      // mark as visited
      grid[ current_node[0] ][ current_node[1] ].set_visited = true;
      dfs_visited_nodes.push( current_node );


      if ( grid[ current_node[0] ][ current_node[1] ].get_node_type != 'end' ) {

          // check adjecent nodes arbitrarily( in this case: up, right, down, left
          var adjacent_nodes = new Array();

          // check up for array bounds and wall
          if( current_node[0] - 1  >= 0 )
          {
              if ( grid[ current_node[0]-1 ][ current_node[1] ].get_node_type != 'wall' ) {
                  adjacent_nodes.push( [ current_node[0]-1, current_node[1] ] );
              }
          }
          // check right
          if( current_node[1] + 1  < grid[1].length )
          {
              if ( grid[ current_node[0] ][ current_node[1]+1 ].get_node_type != 'wall' ) {
                  adjacent_nodes.push( [ current_node[0], current_node[1] + 1 ] );
              }
          }
          // check down
          if( current_node[0] + 1  < grid.length )
          {
              if ( grid[ current_node[0] + 1 ][ current_node[1] ].get_node_type != 'wall' ) {
                  adjacent_nodes.push( [ current_node[0] + 1, current_node[1] ] );
              }

          }
          //check left
          if( current_node[1] - 1  >= 0 )
          {
              if ( grid[ current_node[0] ][ current_node[1]-1 ].get_node_type != 'wall' ) {
                  adjacent_nodes.push( [ current_node[0] , current_node[1] - 1 ] );
              }
          }
          while ( adjacent_nodes.length > 0 )
          {
              //expand adjacent nodes if not visited
              current_adjacent_node = adjacent_nodes.shift();
              if( ! grid[ current_adjacent_node[0]][current_adjacent_node[1]].get_visited )
              {
                  DFSUtil( current_adjacent_node, grid );
              }

          }



      } else {
          // displayNodeTypes();
          dfs_not_found_end_node = false;
          // console.log(visited_array);
          // dfs_visited_nodes = visited_array;
          // draw_grid = true;
      }
  }
  // drawGrid( view_matrix );
  // console.log(  grid[start_node[0], start_node[1]].get_visited );
}