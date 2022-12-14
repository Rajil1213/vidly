import config from 'config';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import passwordComplexity from 'joi-password-complexity';


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
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
{
    methods: {
        generateAuthToken(this) {
            const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
            return token;
        }
    }
})

export const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(5).max(40).required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required()
    });

    return schema.validate(body);
}

export const User = mongoose.model('users', userSchema);