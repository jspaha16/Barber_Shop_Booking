/*********************************
 * This tests have been made by Jorid Spaha
 *
 */
const app = require("../app");
const db = require("../db");
const supertest = require("supertest");
const request = supertest(app);

beforeAll(async () => await db.connect());

afterAll(async () => await db.closeDatabase());

describe("delete appointment", () => {
  it("Check if deleting appointment works works", async () => {
    const res = await request.put(
      `/api/appointment/deleteAppointment?id=62f1b762547bb139c754ae9d`
    );

    expect(res.statusCode).toBe(200);
  });
});
