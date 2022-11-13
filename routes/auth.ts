import bcrypt from 'bcrypt';
import config from 'config';
import express, { Request, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import passwordComplexity from 'joi-password-complexity';
import _ from 'lodash';

import { User } from '../models/user';

const router: express.Router = express.Router();

const validateUser = (body: {}): Joi.ValidationResult => {
    const schema: Joi.ObjectSchema = Joi.object({
        email: Joi.string().email().required(),
        password: passwordComplexity().required()
    });

    return schema.validate(body);
}

router.post('/', async (req: Request, res: Response) => {
    const { error } = validateUser(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if the user is already registered
    let user = await User.findOne({email: req.body.email})

    if (!user) return res.status(400).send("Invalid email or password.");

    let validPassword: boolean | void;
    if (user.password) {
        validPassword = await bcrypt.compare(req.body.password, user.password);
    }
    
    try{
        if (validPassword) {
            const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
            res.send(token);
        }
        else {
            return res.status(400).send("Invalid email or password.");
        }
    }
    catch (err: any) {
        res.send(err.message);
    }
})

export default router;