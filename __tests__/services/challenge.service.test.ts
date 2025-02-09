import mongoose from 'mongoose';
import ChallengeService from '../../src/services/challenge.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import cron from 'node-cron';








describe('ChallengeService', () => {
    let mongoserver: MongoMemoryServer;
    let cronJob: cron.ScheduledTask;


    beforeAll(async() => {
        mongoserver =  await MongoMemoryServer.create();
        const uri = mongoserver.getUri();
        await mongoose.connect(uri);
    })

    afterAll(async() => {
        await mongoose.disconnect();
        await mongoserver.stop();
    })

    beforeEach(() => {
        cronJob = cron.schedule('0 0 * * *', async () => {
          console.log('Running scheduled task');
        });
      });
      
      afterEach(() => {
        if (cronJob) {
          cronJob.stop();
        }
      });



    describe('Create a challenge', () => {
        it("it should create challenge successfully", async() => {
            const challengeData = {
                title: 'Test Challenge',
                startTime: "2025-02-27", 
                deadline: "2025-05-27", 
                prize: '$1000',
                contactEmail: 'test@example.com',
                description: 'Test description',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
            };

            const createdChallenge =  await ChallengeService.createChallenge(challengeData);

            expect(createdChallenge).toBeDefined();
            expect(createdChallenge.title).toBe(challengeData.title)
            expect(createdChallenge.prize).toBe(challengeData.prize)
            expect(createdChallenge.duration).toBe('89 days')
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
                startTime: "2025-02-27", 
                deadline: "2025-01-27", 
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
                startTime: "2025-02-27", 
                deadline: "2025-05-27", 
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


    describe("Update challenge by id", () => {
        it("it should update the challenge", async() => {
            const challengeData = {
                title: 'Test Challenge',
                startTime: "2025-02-27", 
                deadline: "2025-05-27", 
                prize: '$1000',
                contactEmail: 'test@example.com',
                description: 'Test description',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
            }

            const createdChallenge = await ChallengeService.createChallenge(challengeData);
            
            const updateChallengeData = {
                 title: "Challenge test 1",
                 prize: '$2000'
            }

            const updatedChallenge = await ChallengeService.updateChallenge(createdChallenge._id.toString(), updateChallengeData as any);

            expect(updateChallengeData).toBeDefined();
            expect(updatedChallenge.prize).toBe(updateChallengeData.prize)
        })

        it("it should throw an error if the challenge is not found", async () => {
            const nonExistentId = "64b9c2f4f2c43b6a947854c1";
    
            const updateChallengeData = {
                title: "Non-existent Challenge",
                prize: "$5000",
            };
            await expect(ChallengeService.updateChallenge(nonExistentId, updateChallengeData as any)).rejects.toThrow(
                "Challenge not found"
            );
        });
    })
    

    describe("Delete a challenge", () => {
        it("it should delete a challenge by id", async() => {
            const challengeData = {
                title: 'Test Challenge',
                startTime: "2025-02-27", 
                deadline: "2025-05-27", 
                prize: '$1000',
                contactEmail: 'test@example.com',
                description: 'Test description',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
            }
    
            const createdChallenge = await ChallengeService.createChallenge(challengeData);

            const deleteChallenge = await ChallengeService.deleteChallenge(createdChallenge._id.toString());

            expect(deleteChallenge).toBeUndefined();
        })

        it("it should throw exception if challenge is not found", async() => {
            const nonExistentId = "64b9c2f4f2c43b6a947854c1";
    
            const updateChallengeData = {
                title: "Non-existent Challenge",
                prize: "$5000",
            };
            await expect(ChallengeService.updateChallenge(nonExistentId, updateChallengeData as any)).rejects.toThrow(
                "Challenge not found"
            );
        })
    })


    describe("get challenge stats", () => {
        it("it should return all challenge stats based on challenge status", async () => {
            const challengeData = {
                title: 'Test Challenge',
                startTime: "2025-02-27", 
                deadline: "2025-05-27", 
                prize: '$1000',
                contactEmail: 'test@example.com',
                description: 'Test description',
                brief: 'Test brief',
                deliverables: 'Test deliverables',
                requirements: 'Test requirements',
            };
        
            const createdChallenge = await ChallengeService.createChallenge(challengeData);
        
            const challengeStats = await ChallengeService.getChallengeStats();
        
            console.log('Challenge Stats:', challengeStats);
        
            expect(challengeStats).toBeDefined();
            expect(challengeStats.totalOpen).toBe(4);
            expect(challengeStats.totalOngoing).toBe(0);
            expect(challengeStats.totalCompleted).toBe(0);
        });
        
    })
})