import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkoutPlan extends Document {
  userId: mongoose.Types.ObjectId;
  name: string; // e.g., "AI Generated - Chest Day"
  exercises: {
    name: string;
    sets: number;
    reps: string; // e.g., "8-12"
  }[];
}

const WorkoutPlanSchema: Schema<IWorkoutPlan> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    exercises: [
      {
        name: { type: String, required: true },
        sets: { type: Number, required: true },
        reps: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

const WorkoutPlan: Model<IWorkoutPlan> =
  mongoose.models.WorkoutPlan ||
  mongoose.model<IWorkoutPlan>("WorkoutPlan", WorkoutPlanSchema);

export default WorkoutPlan;