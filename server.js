const express = require('express');
const app = express();
const routes = require("./routes");
const path = require('path');

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(routes);

app.listen(3000, () => {
    console.log("http://localhost:3000");
})