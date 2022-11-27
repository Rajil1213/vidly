import mongoose from "mongoose";
import { auth } from "../../../middleware/auth";
import { User } from "../../../models/user"

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const userObject = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
        const token = new User(userObject).generateAuthToken();
        // use type 'any' to opt out of type checking
        const req: any = ({
            header: jest.fn().mockReturnValue(token),
        })
        const res: any = {};
        const next: any = jest.fn()
        auth(req, res, next);
        
        expect(req.user).toMatchObject(userObject);
    })
})