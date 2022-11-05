import express, { Request, Response } from 'express';
import Joi from 'joi';
import mongoose, { mongo } from 'mongoose';

const router: express.Router = express.Router();

// setup db: use vidly
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

const customerSchema = new mongoose.Schema({
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

// setup collection: Customer = db.customers
const Customer = mongoose.model('customers', customerSchema);

const validateBody = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.boolean().default(false),
        phone: Joi.string().required()
    });

    return schema.validate(body);
}

router.get('/', async (req: Request, res: Response) => {
    const customers = await Customer.find().select({name: 1, isGold: 1, phone: 1}).sort({name: 1});
    return res.send(customers);
})

router.get('/:id', async (req: Request, res: Response) => {
    const customer = await Customer.findOne({_id: req.params.id}).select({name: 1, isGold: 1, phone: 1});
    if (!customer) return res.status(400).send(`${req.params.id} is an invalid id`)
    return res.send(customer);
})

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateBody(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const name = req.body.name;
    const isGold = req.body.isGold || false;
    const phone = req.body.phone;
    const customer = new Customer({
        name,
        isGold,
        phone
    })

    try{
        const result = await customer.save();
        res.send(result);
    }
    catch (err: any) {
        res.send(err.message);

    }
})

router.put('/:id', async (req: Request, res: Response) => {
    // if JSON body is invalid
    const { error } = validateBody(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const name = req.body.name;
    const isGold = req.body.isGold || false;
    const number = req.body.number;
    const result = await Customer.findByIdAndUpdate(req.params.id, {
        $set: { name: name, isGold: isGold, number: number}
    }, {new: true})
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)
    res.send(result);
})

router.delete('/:id', async (req: Request, res: Response) => {
    const result = await Customer.findByIdAndDelete(req.params.id);
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)

    res.send(result);
})

export default router;