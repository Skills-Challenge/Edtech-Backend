import mongoose from 'mongoose';
import Challenge from '../../src/models/challenge.model';
import ChallengeService from '../../src/services/challenge.service';
import { MongoMemoryServer } from 'mongodb-memory-server';



describe('ChallengeService', () => {
    let mongoserver: MongoMemoryServer;


    beforeAll(async() => {
        mongoserver =  await MongoMemoryServer.create();
        const uri = mongoserver.getUri();
        await mongoose.connect(uri);
    })

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoserver.stop();
    })



    describe('Create a challenge', () => {
        it("it should create challenge successfully", async() => {
            const challengeData = {
                title: 'Test Challenge',
                deadline: new Date(Date.now() + 86400000), 
                prize: '$1000',
                contactEmail: 'test@example.com',
                description: 'Test description',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
            }

            const createdChallenge =  await ChallengeService.createChallenge(challengeData);

            expect(createdChallenge).toBeDefined();
            expect(createdChallenge.title).toBe(challengeData.title)
            expect(createdChallenge.prize).toBe(challengeData.prize)
            expect(createdChallenge.duration).toBe('1 days')
        })


        it("it should throw exception if deadline not provided" , async() => {
            const invalidChallengeData = {
                title: 'Test Challenge',
                prize: '$1000',
                contactEmail: 'test@example.com',
                description: 'Test description',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
            }
            await expect(ChallengeService.createChallenge(invalidChallengeData as any)).rejects.toThrow(
                'deadline is required.'
              );
        })

        it("it should throw an error if deadline is in past" , async() => {
            const invalidChallengeData = {
                title: 'Test Challenge',
                prize: '$1000',
                deadline: new Date(Date.now() - 86400000),
                contactEmail: 'test@example.com',
                description: 'Test description',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
            }
            await expect(ChallengeService.createChallenge(invalidChallengeData as any)).rejects.toThrow(
                'Deadline must be later than the current time.'
            )
        })
    })


    describe("Get a challenge by id", () => {
        it("It should get challenge by id", async() => {
            const challengeData = {
                title: 'Fetchable Challenge',
                deadline: new Date(Date.now() + 86400000), 
                prize: '$2000',
                contactEmail: 'fetch@example.com',
                description: 'Fetch test',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
              };
        
              const createdChallenge = await ChallengeService.createChallenge(challengeData);
              const fetchedChallenge = await ChallengeService.getChallengeById(createdChallenge._id.toString());
    
    
              expect(fetchedChallenge).toBeDefined();
              expect(createdChallenge.duration).toBe(fetchedChallenge?.duration)
        })
    })
})