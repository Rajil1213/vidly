import request from 'supertest';
import { Genre } from '../../models/genre';
import { User } from '../../models/user';

describe('auth middleware', () => {
    let server: any;
    beforeEach(async () => { 
        const mod = await import('../../index')
        server = (mod as any).default;
    });
    afterEach(async () => {
        if (server) {
            await server.close();
        }
        // Cleanup for valid POST request
        await Genre.deleteMany({});
    });

    // Happy Path
    let token: string
    const exec =  () => {
        return request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name: "valid"})
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    })

    it('should return 401 if no token is provided', async () => {
        token = "";
        const res = await exec();
        expect(res.status).toBe(401);
    })

    it('should return 400 if invalid token is provided', async () => {
        token = "a";
        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    })
})