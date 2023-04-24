const { Schema, model } = require("mongoose");

const LibroSchema = Schema({
    titulo: {
        type: String,
        required: [true, "el titulo es obligatorio"],
    },
    descripcion: {
        type: String,
        required: [true, "la descripcion es obligatoria"],
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: "Autor",
        required: [true, "el autor es obligatorio"],
    },
    estado: {
        type: Boolean,
        required: [true, "el estado es obligatorio"],
        default: true,
    },
    categoria: [
        {
            type: Schema.Types.ObjectId,
            ref: "Categoria",
            required: [true, "la categoria es obligatoria"],
        },
    ],
    imagen: {
        type: String,
    },
});

LibroSchema.methods.toJSON = function () {
    const { __v, estado, _id, ...libro } = this.toObject();
    libro.uid = _id;
    return libro;
}

module.exports = model("Libro", LibroSchema);