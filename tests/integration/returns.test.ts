import mongoose from 'mongoose';
import { Rental } from '../../models/rental';
import request from 'supertest';

describe('/api/returns', () => {
    let server: any;
    let customerId: mongoose.Types.ObjectId;
    let movieId: mongoose.Types.ObjectId;
    let rental: any;
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

    it('should return 401 if the client is not logged in', async () => {
        const res = await request(server)
            .post('/api/returns')
            .send({
                customerId,
                movieId
            })
        expect(res.status).toBe(401);
    })
})