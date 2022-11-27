import Joi from 'joi';
import moment from 'moment';
import mongoose from "mongoose";

// for ObjectID validation
import { joiObjectId } from 'ts-joi-objectid';
const joi_oid = joiObjectId(Joi);

// define fields from the `Customer` and `Movie` schema that are required here
const HybridCustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5, 
        maxlength: 50
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

const HybridMovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255 
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
})

const rentalSchema = new mongoose.Schema({
    customer: {
        type: HybridCustomerSchema,
        required: true
    },
    movie: {
        type: HybridMovieSchema,
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
},
{
    methods: {
        setRentalFee(this) {
            if (this.dateReturned) {
                let dateOut = moment(this.dateOut);
                let dateReturned = moment(this.dateReturned);
                this.rentalFee = dateReturned.diff(dateOut, "days") * this.movie.dailyRentalRate;
            }
        }
    }
})


export const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        customerId: joi_oid().required(),
        movieId: joi_oid().required()
    });

    return schema.validate(body);
}

export const Rental = mongoose.model('rentals', rentalSchema);