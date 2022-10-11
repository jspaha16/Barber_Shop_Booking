/*******************************************************************
 * 
 * This tests have been made by Ali Mohamad Wadhawania (144775210)
 *
 *******************************************************************/

const app = require("../app");
const db = require("../db");
const supertest = require("supertest");
const request = supertest(app);

beforeAll(async () => await db.connect());

afterAll(async () => await db.closeDatabase());

describe("fetching schedules", () => {
  it("test fetching all schedules", async () => {
    const res = await request.get("/api/schedule/getSchedules");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.schedules)).toBe(true);
  });

  describe("fetching Schedule by barber id", () => {
    it("test with valid barber id", async () => {
      const res = await request.get(
        "/api/schedule/getScheduleByBarber/62b12d6850cf566af0b16531"
      );

      const { barber, availability, status } = res.body.schedule;

      expect(res.statusCode).toBe(200);
      expect(barber).toBe("62b12d6850cf566af0b16531");
      expect(Array.isArray(availability)).toBe(true);
      expect(status).toBe("approved");
    });

    it("test with invalid barber id", async () => {
      const res = await request.get(
        "/api/schedule/getScheduleByBarber/62b12d6850cf566af0b54123"
      );

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Please enter a valid barber id");
    });

    it("test with null barber id", async () => {
      const res = await request.get("/api/schedule/getScheduleByBarber");

      expect(res.statusCode).toBe(404);
    });
  });
});

describe("Creating schedules", () => {
  it("test creating schedule of a barber who already has a schedule posted", async () => {
    const res = await request.post("/api/schedule/createSchedule").send({
      barber: "62b12d6850cf566af0b16531",
      availability: [
        {
          day: "Monday",
          startTime: 9,
          endTime: 20,
        },
      ],
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Barber already has a schedule");
  });

  it("test with invalid barber id", async () => {
    const res = await request.post("/api/schedule/createSchedule").send({
      barber: "62b12d6850cf566af0b16555",
      availability: [
        {
          day: "Monday",
          startTime: 9,
          endTime: 20,
        },
      ],
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide a valid barber id");
  });

  it("test with invalid schedule", async () => {
    const res = await request.post("/api/schedule/createSchedule").send({
      barber: "",
      availability: [],
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid input");
  });

  it("test start and end time validation", async () => {
    const res = await request.post("/api/schedule/createSchedule").send({
      barber: "62b12d6850cf566af0b16530",
      availability: [
        {
          day: "Monday",
          startTime: 9,
          endTime: 9,
        },
      ],
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Start time cannot be greater than or equal to end time"
    );
  });

  it("test with valid schedule", async () => {
    const res = await request.post("/api/schedule/createSchedule").send({
      barber: "62b12d6850cf566af0b16530",
      availability: [
        {
          day: "Monday",
          startTime: 9,
          endTime: 15,
        },
      ],
    });

    const schedule = res.body.schedule;

    await request.delete(`/api/schedule/deleteSchedule/${schedule._id}`);

    expect(res.statusCode).toBe(200);
    expect(schedule.barber).toBe("62b12d6850cf566af0b16530");
    expect(schedule.availability.length).toBe(1);
    expect(schedule.status).toBe("pending");
  });
});

describe("Updating schedules", () => {
  it("test invalid schedule id", async () => {
    const res = await request.patch("/api/schedule/updateSchedule").send({
      availability: [{ day: "Monday", startTime: 9, endTime: 17 }],
      id: "62b12f9150cf566af0b16555",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide a valid schedule id");
  });

  it("test null schedule id or availability", async () => {
    const res = await request.patch("/api/schedule/updateSchedule").send({
      availability: [],
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid input");
  });

  it("test start and end time validation", async () => {
    const res = await request.patch("/api/schedule/updateSchedule").send({
      id: "62b12f9150cf566af0b16543",
      availability: [
        {
          day: "Monday",
          startTime: 9,
          endTime: 9,
        },
      ],
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Start time cannot be greater than or equal to end time"
    );
  });

  it("test valid schedule object", async () => {
    const res = await request.patch("/api/schedule/updateSchedule").send({
      availability: [
        {
          day: "monday",
          startTime: 9,
          endTime: 18,
        },
        {
          day: "tuesday",
          startTime: 9,
          endTime: 18,
        },
        {
          day: "wednesday",
          startTime: 9,
          endTime: 18,
        },
        {
          day: "thursday",
          startTime: 9,
          endTime: 18,
        },
        {
          day: "friday",
          startTime: 9,
          endTime: 18,
        },
        {
          day: "saturday",
          startTime: 9,
          endTime: 18,
        },
      ],
      id: "62b12f9150cf566af0b16543",
    });

    const schedule = res.body.schedule;

    expect(res.statusCode).toBe(200);
    expect(schedule._id).toBe("62b12f9150cf566af0b16543");
    expect(schedule.barber).toBe("62b12d6850cf566af0b16531");
    expect(schedule.availability.length).toBe(6);
    expect(schedule.status).toBe("pending");
  });
});

describe("Updating schedule status", () => {
  it("test with null values", async () => {
    const res = await request.patch("/api/schedule/updateStatus").send({
      user_id: "",
      schedule_id: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please send all the required fields");
  });

  it("test with invalid manager id", async () => {
    const res = await request.patch("/api/schedule/updateStatus").send({
      user_id: "62b12d6850cf566af0b16533",
      schedule_id: "62b12f9150cf566af0b16543",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide a valid manager id");
  });

  it("test with invalid schedule id", async () => {
    const res = await request.patch("/api/schedule/updateStatus").send({
      user_id: "62b12d6850cf566af0b16530",
      schedule_id: "62b12f9150cf566af0b16666",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please provide a valid schedule id");
  });

  it("test with valid information", async () => {
    const res = await request.patch("/api/schedule/updateStatus").send({
      user_id: "62b12d6850cf566af0b16530",
      schedule_id: "62b12f9150cf566af0b16543",
    });

    const schedule = res.body.schedule;

    expect(res.statusCode).toBe(200);
    expect(schedule._id).toBe("62b12f9150cf566af0b16543");
    expect(schedule.barber).toBe("62b12d6850cf566af0b16531");
    expect(schedule.availability.length).toBe(6);
    expect(schedule.status).toBe("approved");
  });
});
