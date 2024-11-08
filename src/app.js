const express = require('express');
const testRouter = require("./test.js");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("*",testRouter)


app.listen(3000, () => console.log('node on 3000'));