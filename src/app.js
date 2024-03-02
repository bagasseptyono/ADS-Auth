const express = require("express");
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const routes = require("./routes");

app.use(express.json());

app.use("/", routes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});




const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
