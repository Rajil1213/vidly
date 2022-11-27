import request  from 'supertest';

describe('/api/genres', () => {
    let server: any;
    beforeAll(async () => {
        const mod = await import('../../index')
        server = (mod as any).default;
    });
    afterAll((done) => {
        if (server) {
            server.close(done);
        }
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
           const res = await request(server).get('/api/genres');
           expect(res.status).toBe(200); 
        })
    })
})