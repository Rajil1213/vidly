import { User } from "../../../models/user";
import config from 'config';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

describe('user.generateAuthToken', () => {

    it('should return a valid json web token', () => {
        const userObject = {_id: new mongoose.Types.ObjectId(), isAdmin: true}
        const user = new User(userObject)
        const token = user.generateAuthToken()
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"))

        expect(decoded).toMatchObject(userObject);
    });
})