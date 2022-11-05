import Joi from 'joi';
import mongoose from "mongoose";

export const Customer = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true
    }
})

export const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean().default(false),
        phone: Joi.string().required()
    });

    return schema.validate(body);
}
