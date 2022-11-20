import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import _ from 'lodash';
import { auth } from '../middleware/auth';

import { User, validateBody } from '../models/user';

const router: express.Router = express.Router();

router.get('/me', auth, async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id).select("-password"); // get user but exclude pw
    res.send(user);
})

router.post('/register', async (req: Request, res: Response) => {
    const { error } = validateBody(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if the user is already registered
    let user = await User.findOne({email: req.body.email})

    if (user) return res.status(400).send("User is already registered.");

    user = new User(_.pick(req.body, ["name", "email", "password"]))

    const salt = await bcrypt.genSalt(10);
    // if user.password is not undefined
    if (user.password) {
        user.password = await bcrypt.hash(user.password, salt);
    }

    try {
        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch (err: any) {
        res.send(err.message);
    }
})

export default router;