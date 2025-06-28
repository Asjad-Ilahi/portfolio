import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Leaderboard from '@/models/Leaderboard';

export async function GET() {
  try {
    await connectToDatabase();
    const topScores = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(1000)
      .exec();

    return NextResponse.json(topScores);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, score } = body;

    if (!name || !score) {
      return NextResponse.json({ error: 'Name and score are required' }, { status: 400 });
    }

    await connectToDatabase();
    const newEntry = new Leaderboard({
      name,
      score,
      timestamp: new Date()
    });

    await newEntry.save();

    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
