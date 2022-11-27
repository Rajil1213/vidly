import request  from 'supertest';
import { Genre } from '../../models/genre';

describe('/api/genres', () => {
    let server: any;
    beforeAll(async () => {
        const mod = await import('../../index')
        server = (mod as any).default;
    });
    afterAll(async () => {
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
})