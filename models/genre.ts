import Joi from 'joi';
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength :3,
        required: true
    }
})

export const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return schema.validate(body);
}

// setup collection: Genre = db.genres
export const Genre = mongoose.model('genres', genreSchema);