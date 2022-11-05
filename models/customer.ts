import Joi from 'joi';
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
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

export const Customer = mongoose.model('customers', customerSchema);