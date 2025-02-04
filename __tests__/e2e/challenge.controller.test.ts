import { MongoDBContainer } from "@testcontainers/mongodb";
import mongoose from "mongoose";
import request from "supertest";



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


      afterAll(async() => {
        await mongoose.connection.close();
        await mongoose.disconnect();
        await mongodbContainer?.stop();
      })

      
})