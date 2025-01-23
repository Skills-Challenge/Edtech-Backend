import mongoose from "mongoose";


const Challenge = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Challenge title is required']
        },
        
        deadline: {
            type: Date,
            require: [true , "Challenge deadline is required"]
        },
        duration: {
            type: String,
            required: [true , "Challenge duration is required"]
        },
        prize: {
            type: String,
            required: [true , "Challenge prize is required"]
        },
        contactEmail: {
            type: String,
            required: [true , "Challenge contact email is required"]
        },
        description: {
            type: String,
            required: [true, "Project Description is required"]
        },
        brief: {
            type: String,
            required: [true, "Project brief is required"]
        },
        requirements: {
            type: String,
            required: [true, "Project requirements are required"]
        },
        deliverables: {
            type: String,
            required: [true, "Project deliverables are required"]
        },
        createdAt: {
            type: Date,
        },
        lastModified: {
            type: Date
        }
    },
    {
        timestamps: true
    }
)


export default mongoose.model('Challenge', Challenge);