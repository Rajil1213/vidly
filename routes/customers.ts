import express, { Request, Response } from 'express';
import { admin } from '../middleware/admin';
import { auth } from '../middleware/auth';

import { Customer, validateBody } from '../models/customer';
import { asyncMiddleware } from '../middleware/async';

const router: express.Router = express.Router();

router.get('/', asyncMiddleware(async (req: Request, res: Response) => {
    const customers = await Customer.find().select({name: 1, isGold: 1, phone: 1}).sort({name: 1});
    return res.send(customers);
}))

router.get('/:id', asyncMiddleware(async (req: Request, res: Response) => {
    const customer = await Customer.findOne({_id: req.params.id}).select({name: 1, isGold: 1, phone: 1});
    if (!customer) return res.status(400).send(`${req.params.id} is an invalid id`)
    return res.send(customer);
}))

router.post('/', auth, async (req: Request, res: Response) => {
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

router.put('/:id', auth, async (req: Request, res: Response) => {
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

router.delete('/:id', [auth, admin], asyncMiddleware(async (req: Request, res: Response) => {
    const result = await Customer.findByIdAndDelete(req.params.id);
    if (!result) return res.status(400).send(`${req.params.id} is an invalid id`)

    res.send(result);
}))

export default router;