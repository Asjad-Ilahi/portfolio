import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export interface ILeaderboard extends mongoose.Document {
  name: string;
  score: number;
  timestamp: Date;
}

export default mongoose.models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
