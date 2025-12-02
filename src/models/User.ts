import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  goals?: string; // e.g., "Muscle Gain"
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
    goals: { type: String },
  },
  { timestamps: true }
);

// Ye check karta hai ki model pehle se exist karta hai ya nahi (Next.js hot reload fix)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;