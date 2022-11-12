import express, { Request, Response } from 'express';

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

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    user = new User({
        name,
        email,
        password
    })

    try{
        await user.save();
        res.send(user);
    }
    catch (err: any) {
        res.send(err.message);
    }
})

export default router;