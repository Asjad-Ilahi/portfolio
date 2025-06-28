import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Leaderboard from '@/models/Leaderboard';

export async function GET() {
  try {
    await connectToDatabase();
    const topScores = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(1000)
      .lean() // ensure plain objects
      .exec();
    // Convert timestamp to number for frontend compatibility
    const mapped = topScores.map(entry => ({
      ...entry,
      timestamp: entry.timestamp instanceof Date ? entry.timestamp.getTime() : entry.timestamp
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name;
    let score = body.score;
    // Ensure score is a number (parse if string)
    score = typeof score === 'string' ? Number(score) : score;
    if (!name || typeof score !== 'number' || isNaN(score)) {
      return NextResponse.json({ error: 'Name and valid score are required' }, { status: 400 });
    }
    await connectToDatabase();
    const newEntry = new Leaderboard({
      name,
      score,
      timestamp: new Date()
    });
    await newEntry.save();
    return NextResponse.json({
      name: newEntry.name,
      score: newEntry.score,
      timestamp: newEntry.timestamp.getTime()
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}
