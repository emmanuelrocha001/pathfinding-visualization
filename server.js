const express = require('express');

app = express();
const port = process.env.PORT || 3000;

//start server
app.listen(port, () => console.log('listening at port %d', port));
// host static file
app.use(express.static(__dirname));