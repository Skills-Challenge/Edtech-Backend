import mongoose from "mongoose";

const Challenge = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Challenge title is required']
    },
    startTime: {
      type: Date,
      required: [true, "Challenge start time is required"]
    },
    deadline: {
      type: Date,
      required: [true, "Challenge deadline is required"]
    },
    duration: {
      type: String,
      required: [true, "Challenge duration is required"]
    },
    prize: {
      type: String,
      required: [true, "Challenge prize is required"]
    },
    contactEmail: {
      type: String,
      required: [true, "Challenge contact email is required"]
    },
    description: {
      type: [String],
      required: [true, "Project description is required"]
    },
    brief: {
      type: String,
      required: [true, "Project brief is required"]
    },
    requirements: {
      type: [String],
      required: [true, "Project requirements are required"]
    },
    deliverables: {
      type: [String],
      required: [true, "Project deliverables are required"]
    },
    status: {
      type: String,
      enum: ['completed', 'open', 'ongoing'],
      default: 'open'
    },
    seniorityLevel:{
      type: [String],
      required: [true, "Seniority Levels are required for every challenge"]
    },
    skills: {
      type: [String],
      required: [true , "Skills are required"]
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Challenge', Challenge);
