/*********************************
 * This tests have been made by Klaus Cepani(157246208)
 *
 */

const app = require("../app");
const db = require("../db");
const supertest = require("supertest");
const request = supertest(app);

beforeAll(async () => await db.connect());

afterAll(async () => await db.closeDatabase());

describe("booking", () => {
  it("Check if booking works", async () => {
    const res = await request.post("/api/appointment/createAppointment").send({
      date: "9/8/2022",
      services: ["62b132ce50cf566af0b16549"],
      customer: "62b12d6850cf566af0b16530",
      barber: "62b12d6850cf566af0b16532",
      timeSlot: { startTime: "1", endTime: "2" },
      status: "scheduled",
    });

    expect(res.statusCode).toBe(200);
  });
  it("Date is in the past", async () => {
    const res = await request.post("/api/appointment/createAppointment").send({
      date: "7/8/2022",
      services: ["62b132ce50cf566af0b16549"],
      customer: "62b12d6850cf566af0b16530",
      barber: "62b12d6850cf566af0b16532",
      timeSlot: { startTime: "1", endTime: "2" },
      status: "scheduled",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please select a valid date");
  });

  it("Empty fields", async () => {
    const res = await request.post("/api/appointment/createAppointment").send({
      date: "",
      services: ["62b132ce50cf566af0b16549"],
      customer: "62b12d6850cf566af0b16530",
      barber: "62b12d6850cf566af0b16532",
      timeSlot: { startTime: "", endTime: "" },
      status: "scheduled",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Don't leave empty fields");
  });

  it("Start time smaller then end time", async () => {
    const res = await request.post("/api/appointment/createAppointment").send({
      date: "9/8/2022",
      services: ["62b132ce50cf566af0b16549"],
      customer: "62b12d6850cf566af0b16530",
      barber: "62b12d6850cf566af0b16532",
      timeSlot: { startTime: "2", endTime: "1" },
      status: "scheduled",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe(
      "Please the Start Time should be smaller then the End Time"
    );
  });

  it("Entering a wrong type string ", async () => {
    const res = await request
      .post("/api/appointment/createAppointment")
      .send({
        date: "9/8/2022",
        services: ["62b132ce50cf566af0b16549"],
        customer: "62b12d6850cf566af0b16530",
        barber: "62b12d6850cf566af0b16532",
        timeSlot: { startTime: "s", endTime: "s" },
        status: "scheduled",
      });
  });
});

{
  /** Nirmal Cancel all Appointment by date and barber Name  booking Id*/
}
describe("Cancel All Appointment for a day by particular barber", () => {
  it("Cancel Appointment By Date and Barber Id", async () => {
    const res = await request.put(
      "/api/appointment/getAppointmentsByDateAndBarber?date=2022-07-08T04:00:00.000Z&barber=62b12d6850cf566af0b16531",
      {
        method: "PUT",
      }
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Successfully Updated");
  });
});
