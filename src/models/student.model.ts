import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IStudent extends Document {
  name: string;
  email: string;
  department: string;
  password?: string; // Optional because it will be hashed
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const StudentSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password by default
  },
}, { timestamps: true });

// Hash password before saving
StudentSchema.pre('save', async function () {
  if (!this.isModified('password') || this.password === undefined) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Compare password method
StudentSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
