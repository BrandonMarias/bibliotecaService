const { Router, response } = require("express");

const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
} = require("../controllers/categoria.controller");

const router = Router();

router.get("", obtenerCategorias);

router.get("/:id", obtenerCategoria);

router.post("", crearCategoria);

router.put("/:id", actualizarCategoria);

router.delete("/:id", eliminarCategoria);

module.exports = router;
