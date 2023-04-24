const { Router, response } = require("express");

const {crearLibro,getLibro,getLibros,actualizarLibro,eliminarLibro,getImage,uploadImage} = require("../controllers/libro.controller");

const router = Router();

router.get("",getLibros);

router.get("/:id",getLibro);

router.post("",crearLibro);

router.put("/:id",actualizarLibro);

router.delete("/:id",eliminarLibro);

router.get("/image/:id",getImage);

router.post("/image/:id",uploadImage);

module.exports = router;
