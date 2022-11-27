import mongoose from 'mongoose';
import request  from 'supertest';
import { Genre } from '../../models/genre';

describe('/api/genres', () => {
    let server: any;
    beforeEach(async () => {
        const mod = await import('../../index')
        server = (mod as any).default;
    });
    afterEach(async () => {
        if (server) {
            server.close();
        }
        // Cleanup
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            // populate
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200); 
            expect(res.body.some((g: {name: string}) => g.name === "genre1")).toBeTruthy()
            expect(res.body.some((g: {name: string}) => g.name === "genre2")).toBeTruthy()
        })
    })

    describe('GET /:id', () => {
        it('should return a valid genre for given id', async () => {
            // populate
            const testGenre = {_id: new mongoose.Types.ObjectId(), name: "genre1"}
            await Genre.collection.insertOne(testGenre)
            const res = await request(server).get(`/api/genres/${testGenre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject(testGenre);
        })
        it('should return 404 if invalid id is passed', async () => {
            // invalid format
            const res_invalid = await request(server).get("/api/genres/1")
            expect(res_invalid.status).toBe(404);
            // valid format, invalid ID
            const res_valid = await request(server).get(`/api/genres/${new mongoose.Types.ObjectId()}`)
            expect(res_valid.status).toBe(404);
        })
    })
})