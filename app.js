require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { conexionDB } = require("./db/conexionDB");

const puerto = process.env.PORT || 8080;
const server = express();

conexionDB();

server.use(cors());
server.use(express.json());

server.use("/autor", require("./routes/autor.routes"));
server.use("/libro", require("./routes/libro.routes"));
server.use("/categoria", require("./routes/categoria.routes"));

server.listen(puerto, () => {
  console.log("servidor levantado en el puerto " + puerto);
});
