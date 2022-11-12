import express, { Request, Response } from 'express';
import _ from 'lodash';

import { User, validateBody } from '../models/user';

const router: express.Router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    const { error } = validateBody(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if the user is already registered
    let user = await User.findOne({email: req.body.email})

    if (user) return res.status(400).send("User is already registered.");

    user = new User(_.pick(req.body, ["name", "email", "password"]))

    try{
        await user.save();
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err: any) {
        res.send(err.message);
    }
})

export default router;