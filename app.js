const express = require('express');
const cors = require("cors");

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Routes
app.use('/', require('./routes/routeValidation'));

//Server listening on port 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port} `);
});