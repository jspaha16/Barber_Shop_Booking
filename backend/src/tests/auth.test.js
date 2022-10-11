const app = require("../app");
const db = require("../db");
const supertest = require("supertest");
const request = supertest(app);

beforeAll(async () => await db.connect());

afterAll(async () => await db.closeDatabase());

describe("login", () => {
  it("check non-existant username & password", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: "abcd@hmail.com", password: "hgdfdsdhfgdskj" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Incorrect email");
  });

  it("test incorrect password", async () => {
    const res = await request.post("/api/auth/login").send({
      email: "s.faulkner@powerrangers.com",
      password: "WrongPassword",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("test admin login", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: "s.faulkner@powerrangers.com", password: "HelloWorld!" });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("62b12d6850cf566af0b16530");
    expect(res.body.email).toBe("s.faulkner@powerrangers.com");
    expect(res.body.userType).toBe("mg");
    expect(res.body.token).toBeDefined();
  });

  it("test barber login", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: "m.meyer@powerrangers.com", password: "HelloWorld123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("62b12d6850cf566af0b16531");
    expect(res.body.email).toBe("m.meyer@powerrangers.com");
    expect(res.body.userType).toBe("bb");
    expect(res.body.token).toBeDefined();
  });

  it("test customer login", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: "a.stewart@powerrangers.com", password: "Hello__World" });

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("62f31441e3b7f069ae0cb9c0");
    expect(res.body.email).toBe("a.stewart@powerrangers.com");
    expect(res.body.userType).toBe("cs");
    expect(res.body.token).toBeDefined();
  });
});

describe("signup", () => {
  it("test if user already exists", async () => {
    const res = await request.post("/api/auth/signup").send({
      fname: "Aurora",
      lname: "Stewart",
      email: "a.stewart@powerrangers.com",
      password: "BIGnbchsgc7656%%",
      phone: "9999999999",
      userType: "mg",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already in use");
  });

  it("test if user is created", async () => {
    const res = await request.post("/api/auth/signup").send({
      fname: "Adam",
      lname: "Camplle",
      email: "a.camplle@powerrangers.com",
      password: "BIGnbchsgc7656%%",
      phone: "9999999999",
      userType: "cs",
    });

    await request.delete(`/api/user/deleteUser/${res.body.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("a.camplle@powerrangers.com");
    expect(res.body.userType).toBe("cs");
    expect(res.body.id).toBeDefined();
    expect(res.body.token).toBeDefined();
  });
});
