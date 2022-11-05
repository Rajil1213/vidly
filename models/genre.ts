import Joi from 'joi';
import mongoose from "mongoose";

export const Genre = new mongoose.Schema({
    name: {
        type: String,
        minlength :3,
        required: true
    }
})

export const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(body);
}