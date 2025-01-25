import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../src/app";

describe("Test app.ts", () => {
  test("Catch-all route", async () => {
    const res = await request(app).get("/not-existent");
    expect(res.status).toEqual(StatusCodes.NOT_FOUND);
  });
});