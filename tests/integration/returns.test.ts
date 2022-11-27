import mongoose from 'mongoose';
import { Rental } from '../../models/rental';
import request from 'supertest';
import { User } from '../../models/user';

describe('/api/returns', () => {
    let server: any;
    let rental: any;
    let customerId: any;
    let movieId: any;
    beforeEach(async () => {
        const mod = await import('../../index')
        server = (mod as any).default;
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        rental = new Rental({
            customer: {
                _id: customerId, 
                name: "customerName",
                phone: "01234" 
            },
            movie: {
                _id: movieId,
                title: "movieTitle",
                dailyRentalRate: 2
            }
        })
        await rental.save();
    });
    afterEach(async () => {
        if (server) {
            await server.close();
        }
        // Cleanup
        await Rental.deleteMany({});
    });

    // Happy path
    let body: any;
    let token: string;
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send(body)
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
        body = {
            customerId,
            movieId
        }
    })

    it('should return 401 if the client is not logged in', async () => {
        token = ""
        const res = await exec();
        expect(res.status).toBe(401);
    })

    it('should return 400 if customerId is not provided', async () => {
        body = {
            movieId
        }
        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 400 if movieId is not provided', async () => {
        body = {
            customerId
        }
        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 404 if no rental found for the given customer/movie', async () => {
        body = {
            customerId: movieId,
            movieId: customerId
        }
        const res = await exec();
        expect(res.status).toBe(404);
    })

    it('should return 300 if rental is aleady processed', async () => {
        const rental = await Rental.findOne({
            "customer._id": customerId,
            "movie._id": movieId
        })
        if (rental) {
            rental.dateReturned = new Date(Date.now());
            await rental.save();
            const res = await exec();
            expect(res.status).toBe(300);
        }
    })

    it('should return 200 if the request is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    })
})