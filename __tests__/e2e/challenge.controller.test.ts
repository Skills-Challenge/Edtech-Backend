import { MongoDBContainer } from "@testcontainers/mongodb";
import "jest";
import mongoose from "mongoose";
import request from "supertest";
import { ChallengeData } from "../../src/types";
import app from "../../src/app";



describe("Challenge API EndPoints", () => {

    let mongodbContainer: any;
    let challengeId: any;


    beforeAll(async () => {
      mongodbContainer = await new MongoDBContainer().start();
      await mongoose.connect(mongodbContainer.getConnectionString(), {
        directConnection: true,
      });
      console.log("Connected to MongoDB");
    });
  
    afterAll(async () => {
      await mongoose.connection.close();
      await mongoose.disconnect();
      await mongodbContainer?.stop();
    });

      const newChallenge: ChallengeData = {
        title: "Design a Dashboard for Sokofound",
        startTime: "2025-01-27",
        deadline: "2025-02-27",
        prize: "$150",
        contactEmail: "talent@umurava.africa",
        brief: "A finitech company that is developing digital financial platform designed for business and their workforce in africa",
        description: "User interface for each step",
        requirements:"Understanding user needs",
        deliverables: "The product designer will provide all documents and deliverables to the client before review meetings"
      };



      it("should create a new challenge", async() => {
        const response = await request(app)
         .post("/challenge/create")
         .set("Accept", "application/json")
         .send(newChallenge);



         expect(response.status).toBe(200);
         expect(response.headers['content-type']).toMatch("/json/")
        

         expect(response.body.challenge.title).toBe(newChallenge.title);
      })


      
})