import Joi from 'joi';
import mongoose from "mongoose";

// define fields from the Genre schema that are required here
const HybridSchema = new mongoose.Schema({
    name: String
})

interface customerInterface {
    title: string;
    numberInStock: number;
    dailyRentalRate: number;
    genre: typeof HybridSchema;
}

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        // default to 0 if not in stock, else 100
        default: function (this: customerInterface) {
            if (this.numberInStock > 0) return 0;
            return 100;
        },
        min: 0,
        max: 255
    },
    genre: {
        type: HybridSchema,
        required: true
    }
})

export const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required(),
        // for name
        genre: Joi.string().min(3).required()
    });

    return schema.validate(body);
}

export const Movie = mongoose.model('movies', movieSchema);