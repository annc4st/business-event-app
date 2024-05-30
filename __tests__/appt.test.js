const app = require("../app");
const db = require("../db/connection");

const request = require("supertest");
const seed = require("../db/seeds/seed.js");

const {
  eventData,
  categoryData,
  locationData
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({
    eventData, categoryData, locationData
  });
});

afterAll(() => {
  db.end();
})

describe("General testing", () => {
  test("should return 404 if path spelt wrong or does not exist", () => {
    return request(app)
      .get("/api/not-existing-path")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("path is not found");
      });
  });
});

describe("GET /api/categories", () => {
  test("responds with status 200 and array categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({body}) => {
       
        expect(body).toHaveLength(3);
        body.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        })
      })
  })
})

describe("GET /api/events", () => {
  test("responds with status 200 and array of events", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then((response) => {
        // console.log(response);
        expect(response.body).toHaveLength(4);
      })
  })
  test("when category responds with status 200 and array of events on the category", () => {
    return request(app)
      .get("/api/events?category=running")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body).toHaveLength(2);
        expect(response.body).toEqual(expect.any(Array));
        response.body.forEach(event => {
          expect(event.category).toBe("running");
        });
      })
  })

  test("should return 404 if category does not exist", async () => {
    const response = await request(app)
      .get("/api/events?category=nonexistent")
      .expect(404);
      
    expect(response.body.message).toBe("Category does not exist");
  });
});

describe("GET /api/events/:event_id", () => {
  test("responds with status 200 and event if exists", () => {
    return request(app)
      .get("/api/events/2")
      .expect(200)
      .then(({ body }) => {
        // console.log(body)
        expect(body.event_id).toBe(2);
        expect(body.event_name).toBe("test 2 Outdoor Run Session 2");
      })
  })

  test("responds with status 404 if event does not exist", () => {
    return request(app)
      .get("/api/events/98")
      .expect(404)
      .then(({ body }) => {
        // console.log(body)
        expect(body.message).toBe( "Event does not exist" );
      })
  })
  test("responds with status 400 if invalid input", () => {
    return request(app)
      .get("/api/events/invalid-input-syntax")
      .expect(400)
      .then(({ body }) => {
        // console.log(body)
        expect(body.message).toBe('Invalid input syntax');
      })
  })
});
