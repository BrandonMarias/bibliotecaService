const { response } = require("express");
const Categoria = require("../models/categoria");

const crearCategoria = async (req, res = response) => {
    try {
        const { estado, _id, ...data } = req.body;
        const categoria = new Categoria(data);

        await categoria.save();

        return res.json({ categoria, ok: true, msg: "categoria creada" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "error en el servidor al crear categoria" });
    }
};

const obtenerCategorias = async (req, res = response) => {
    try {
        const { limit = "10", from = "0" } = req.query;

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments({ estado: true }),
            Categoria.find({ estado: true })
                .skip(Number(from))
                .limit(Number(limit)),
        ]);

        return res.json({
            total,
            categorias,
            ok: true,
            msg: "lista de categorias",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al listar categorias" });
    }
};

const obtenerCategoria = async (req, res = response) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findOne({ _id: id, estado: true });

        if (!categoria) {
            return res.status(400).json({ error: "categoria no encontrado" });
        }

        return res.json({ categoria, ok: true, msg: "categoria encontrada" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al obtener categoria" });
    }
};

const actualizarCategoria = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { estado, _id, ...data } = req.body;
        const categoria = await Categoria.findByIdAndUpdate(id, data, {
            new: true,
        });

        if (!categoria) {
            return res.status(400).json({ error: "categoria no encontrado" });
        }

        return res.json({ categoria, ok: true, msg: "categoria actualizada" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al actualizar categoria" });
    }
};

const eliminarCategoria = async (req, res = response) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        if (!categoria) {
            return res.status(400).json({ error: "categoria no encontrado" });
        }

        return res.json({ categoria, ok: true, msg: "categoria eliminada" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al eliminar categoria" });
    }
};

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
};

