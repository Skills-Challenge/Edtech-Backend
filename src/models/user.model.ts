import mongoose = require('mongoose');
import { hashPassword } from '../utils/bcrypt';

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
    },

    password: {
      type: String,
      required: [true, 'password is required'],
    },
    role: {
      type: String,
      enum: ['talent','admin'],
      default: 'talent'
  },

    verificationCode: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  },
);

User.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await hashPassword(user.password!);
  }
  next();
});

export default mongoose.model('User', User);
