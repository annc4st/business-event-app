const app = require("../app.js");
const db = require("../db/connection.js");
const {convertToUTC} = require('../models/util_func.js')

const request = require("supertest");
const seed = require("../db/seeds/seed.js");

const {
  eventData,
  categoryData,
  locationData, userData
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({
    eventData, categoryData, locationData, userData
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
      .then(({ body }) => {

        expect(body).toHaveLength(3);
        body.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        })
      })
  })
})
describe("POST /api/categories", () => {
  test("responds with status 201", () => {
    const newCateg = {
      slug: "baby exrcises",
      description: "description for baby exercise"
    }
    return request(app)
      .post(`/api/categories`)
      .send(newCateg)
      .expect(201)
      .then((response) => {

        const { category } = response.body;
        expect(category.description).toEqual("description for baby exercise");
      });
  });

  test("responds with status 422 when required field slug is missing", () => {
    const newCateg = {
      description: "description for baby exercise"
    }
    return request(app)
      .post(`/api/categories`)
      .send(newCateg)
      .expect(422)
      .then((response) => {
        expect(response.body.message).toBe("Category slug and description cannot be empty.")
      });
  });
})

describe("DELETE /api/categories/:slugToDel ", () => {
  test("responds with status 204 when we delete existing category", () => {

    return request(app)
      .delete(`/api/categories/races`)
      .expect(204)
  });


  test("responds with status 404 when we delete non-existing category", () => {
    return request(app)
      .delete(`/api/categories/non-exist-categ`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Category does not exist");
      })
  });
})

describe("GET /api/events", () => {
  test("responds with status 200 and array of events", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(4);
      })
  })
  test("when category responds with status 200 and array of events on the category", () => {
    return request(app)
      .get("/api/events?category=running")
      .expect(200)
      .then((response) => {

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
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Category does not exist");
      });
  });
});

describe("GET /api/events/:event_id", () => {
  test("responds with status 200 and event if exists", () => {
    return request(app)
      .get("/api/events/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.event_id).toBe(2);
        expect(body.event_name).toBe("test 2 Outdoor Run Session 2");
      })
  })

  test("responds with status 404 if event does not exist", () => {
    return request(app)
      .get("/api/events/98")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Event does not exist.');
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

describe('POST /api/events', () => {
  test("responds with status 201", () => {
    const newEvent = {
      event_name: "testing event 6  Triathlon race",
      category: "races",
      description: "An easy description of testing event 6",
      startdate: '2025-07-25',
      starttime: '10:00:00',
      enddate: '2025-07-25',
      endtime: '12:00:00',
      ticket_price: 10.00,
      location: 3,
      image_url: "",
    }
    return request(app)
      .post(`/api/events/`)
      .send(newEvent)
      .expect(201)
      .then((response) => {
        const { event } = response.body;
        expect(event.event_name).toEqual("testing event 6  Triathlon race");
        expect(event.category).toEqual("races");
        expect(event.description).toEqual("An easy description of testing event 6");
        // Convert received UTC date to local date for comparison
        const receivedStartTime = convertToUTC(newEvent.startdate, newEvent.starttime);
        // console.log(receivedStartTime)
        expect(receivedStartTime).toEqual('2025-07-25T10:00:00.000Z');
      });
  });

  test("responds with status 422 when required fields are missing", () => {
    const newEvent = {
      event_name: "testing event 6  Triathlon race",
      category: "races",
      description: "An easy description of testing event 6",
      startdate: '2023-07-25',
      starttime: '10:00:00',
      enddate: '2023-07-25',
      endtime: '12:00:00',
      // ticket_price: 10.00, missing
      location: 3,
      image_url: "",
    }
    return request(app)
      .post(`/api/events`)
      .send(newEvent)
      .expect(422)
      .then((response) => {
        expect(response.body.message).toBe('Event details (name, category, description, startdate, starttime, enddate, endtime, ticket_price, location) cannot be empty.')
      })
  });

  test("responds with status 422 when required fields are missing", () => {
    const newEvent = {
      event_name: "testing event 6  Triathlon race",
      category: "races",
      description: "An easy description of testing event 6",
      startdate: '2023-07-25',
      starttime: '10:00:00',
      enddate: '2023-07-25',
      endtime: '12:00:00',
      ticket_price: 10.00,
      location: 789,
      image_url: "",
    }
    return request(app)
      .post(`/api/events`)
      .send(newEvent)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Location does not exist');
      })
  });
})


describe("DELETE /api/events/:eventToDel", () => {
  test("responds with status 204 when we delete existing event", () => {
    return request(app)
      .delete(`/api/events/2`)
      .expect(204)
  });

  test("responds with status 404 when we delete non-existing event", () => {
    return request(app)
      .delete(`/api/events/1654`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Event does not exist.");
      })
  });
})