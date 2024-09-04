const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");

const seed = require("../db/seeds/seed.js");
const { userData, categoryData, locationData, eventData } = require("../db/data/test-data/index");

beforeEach(() => {
    return seed({ userData, categoryData, locationData, eventData });
});

  afterAll(() => {
    db.end();
  })
  

//TESTS //
describe("POST Register new user", () => {
    test("1 returns error 400 if fields are not filled", () => {
        const newUser = {
            username: '',
            password: 'password123',
            email: 'tester1@example.com'
          }
      return request(app)
      .post(`/api/auth/register`)
      .send(newUser)
      .expect(400)
      .then((response) => {

        expect(response.body.error).toBe("All fields are required" )
      })
    })
    
    test("2 should register new user", () => {
        const newUser = {
              username: 'tester2',
              password: 'password123',
              email: 'tester1@example.com'
            }
        
        return request(app)
        .post(`/api/auth/register`)
        .send(newUser)
        .expect(201)
        .then(response => {

            expect(response.body.username).toBe(newUser.username)
            expect(response.body).toHaveProperty('username')
            expect(response.body).toHaveProperty('email')
            expect(response.body).toHaveProperty('token')
        })
    })

})