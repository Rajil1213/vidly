import mongoose from 'mongoose';
import request  from 'supertest';
import { Genre } from '../../models/genre';
import { User } from '../../models/user';

describe('/api/genres', () => {
    let server: any;
    beforeEach(async () => {
        const mod = await import('../../index')
        server = (mod as any).default;
    });
    afterEach(async () => {
        if (server) {
            await server.close();
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

    describe('POST /', () => {

        // the common happy path code:
        let token: string;
        let genreName: string;
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: genreName});
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            genreName = "valid";
        })

        it('should return 401 if client is not logged in', async () => {
            token = "";
            const res = await exec();
            expect(res.status).toBe(401);
        })

        it('should return 400 if genre is less than 3 characters', async () => {
            genreName = "02";
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400 if genre is more than 50 characters', async () => {
            genreName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should save the genre if it is valid', async () => {
            const res = await exec();
            // expect response to be OK
            expect(res.status).toBe(200);
            // expect the db to have posted data
            const genreInDb = await Genre.findOne({name: genreName})
            expect(genreInDb).not.toBeNull()
            expect(genreInDb).toHaveProperty('name', genreName);
        })

        it('should return the genre if it is valid', async () => {
            const res = await exec();
            // expect response to be OK
            expect(res.status).toBe(200);
            // expect the object to be returned
            expect(res.body).not.toBeNull()
            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name', genreName)
        })
    })

    describe('PUT /:id', () => {
        // the common happy path code:
        let token: string;
        let body: any;
        let id: mongoose.Types.ObjectId;
        const exec = async () => {
            return await request(server)
                .put(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send(body);
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            id = new mongoose.Types.ObjectId();
            const genreObj = { _id: id, name: "invalid" };
            Genre.collection.insertOne(genreObj);
            body =  {
                name: "valid"
            }
        })

        afterEach(() => {
            // cleanup
            Genre.deleteMany({})
        })

        it('should return 400 if the genre name is not present in request body', async () => {
            body = {"noname": "valid"}
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400 if the genre name has less than 3 letters', async () => {
            body.name = "02"
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should return 400 if the genre name has more than 50 letters', async () => {
            body.name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should update the genre if the name is valid', async () => {
            await exec(); 
            const genre = await Genre.findById(id);
            expect(genre).toHaveProperty("name", body.name);
        })

        it('should return the updated document if the name is valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id")
            expect(res.body).toHaveProperty("name", body.name)
        })
    })

    describe('DELETE /:id', () => {
        // the common happy path code:
        let token: string;
        let id: any;
        let genreObj: {
            _id: mongoose.Types.ObjectId,
            name: string
        };
        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token)
        }

        beforeEach(() => {
            token = new User({isAdmin: true}).generateAuthToken();
            id = new mongoose.Types.ObjectId();
            genreObj = { _id: id, name: "deleteThis" };
            Genre.collection.insertOne(genreObj);
        })

        afterEach(() => {
            // cleanup
            Genre.deleteMany({})
        })

        it('should return 403 if the user is not admin', async () => {
            token = new User({isAdmin: false}).generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        })

        it('should return 404 if the id is of invalid format', async () => {
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        })

        it('should return 400 if the id is invalid', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
        })

        it('should delete the genre if the id is valid', async () => {
            await exec();
            const genre = await Genre.findById(id);
            expect(genre).toBeNull();
        })

        it('should return the deleted genre if the id is valid', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", genreObj.name);
        })
    })
})