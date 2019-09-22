class Node {
    constructor() {
        this._visited = false;
        this._node_type = null;
        this._is_path = true;
        this._weight = null;

    }

    get get_visited() {
        return this._visited;
    }

    set set_visited( visited ) {
        this._visited = visited;
    }

    get get_node_type() {
        return this._node_type;
    }

    set set_node_type( node_type) {
        this._node_type = node_type;
    }

    get get_is_path() {
        return this._is_path;
    }

    set set_is_path( is_path ) {
        this._is_path = is_path;
    }

    get get_weight() {
        return this._weight;
    }

    set set_weight( weight ) {
        this._weight = weight;
    }



}