const { response } = require("express");
const Libro = require("../models/libro");
const { uploadFile, getFile } = require("../helpers/s3");
const { v4: uuidv4 } = require("uuid");

const getLibros = async (req, res = response) => {
    try {
        const { limit = "10", from = "0" } = req.query;
        const [total, libros] = await Promise.all([
            Libro.countDocuments({ estado: true }),
            Libro.find({ estado: true })
                .skip(Number(from))
                .limit(Number(limit))
                .populate("categoria", "nombre")
                .populate("autor", "nombre"),
        ]);

        return res.json({
            total,
            libros,
            ok: true,
            msg: "lista de libros",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al listar libros" });
    }
};

const getLibro = async (req, res = response) => {
    try {
        const { id } = req.params;
        const libro = await Libro.findOne({ _id: id, estado: true })
            .populate("categoria", "nombre")
            .populate("autor", "nombre");

        if (!libro) {
            return res.status(400).json({ error: "libro no encontrado" });
        }

        return res.json({ libro, ok: true, msg: "libro encontrado" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al obtener libro" });
    }
};

const crearLibro = async (req, res = response) => {
    try {
        const { estado, _id, ...data } = req.body;
        const libro = new Libro(data);
        await libro.save();
        return res.json({ libro, ok: true, msg: "libro creado" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al crear libro" });
    }
};

const actualizarLibro = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { estado, _id, ...data } = req.body;

        const libro = await Libro.findByIdAndUpdate(id, data, { new: true });

        if (!libro) {
            return res.status(400).json({ error: "libro no encontrado" });
        }

        return res.json({ libro, ok: true, msg: "libro actualizado" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al actualizar libro" });
    }
};

const eliminarLibro = async (req, res = response) => {
    try {
        const { id } = req.params;
        const libro = await Libro.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        if (!libro) {
            return res.status(400).json({ error: "libro no encontrado" });
        }

        return res.json({ libro, ok: true, msg: "libro eliminado" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al eliminar libro" });
    }
};

const uploadImage = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { file } = req;
        const libro = await Libro.findById(id);
        if (!libro) {
            return res.status(400).json({ error: "libro no encontrado" });
        }

        //validar extencion
        const extencionesValidas = ["png", "jpg", "jpeg", "gif"];
        const extencion = file.originalname.split(".");
        if (!extencionesValidas.includes(extencion[extencion.length - 1])) {
            return res.status(400).json({ error: "extencion no valida" });
        }

  
        const nombre = `${uuidv4()}.${extencion[extencion.length - 1]}`;

        const url = await uploadFile(file, nombre);

        libro.imagen = url;
        await libro.save();

        return res.json({ libro, ok: true, msg: "imagen subida" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al subir imagen" });
    }
};

const getImage = async (req, res = response) => {
    try {
        const { id } = req.params;
        const libro = await Libro.findById(id);
        if (!libro) {
            return res.status(400).json({ error: "libro no encontrado" });
        }

        const url = await getFile(libro.imagen);

        return res.json({ url, ok: true, msg: "imagen obtenida" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "error al obtener imagen" });
    }
};

module.exports = { getLibros, getLibro, crearLibro, actualizarLibro, eliminarLibro, uploadImage, getImage };