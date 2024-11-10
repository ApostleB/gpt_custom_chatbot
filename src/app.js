const express = require('express');
const chatRouter = require("./Router/chatRouter.js");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/",chatRouter)

app.listen(3000, () => console.log('node on 3000'));
