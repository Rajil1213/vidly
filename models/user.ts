import Joi from 'joi';
import mongoose from "mongoose";

import { joiPass } from '../util/joi_pass'
const joi_pass = joiPass(Joi)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5,
        maxlength: 40,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        min: 8,
        max: 1024 // because password 
    }
})

export const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(5).max(40).required(),
        email: Joi.string().email().required(),
        password: joi_pass().required()
    });

    return schema.validate(body);
}

export const User = mongoose.model('users', userSchema);