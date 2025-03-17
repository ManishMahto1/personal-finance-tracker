import connectDB from 'lib/dbConnect';
import Transaction from 'models/Transaction';
import { NextResponse } from 'next/server';

// GET all transactions
export async function GET() {
  try {
    await connectDB();
    const transactions = await Transaction.find({});
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new transaction
export async function POST(req) {
  try {
    await connectDB();
    const { amount, date, description,category } = await req.json();
    if (!amount || !date || !description) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const newTransaction = new Transaction({ amount, date, description,category });
    await newTransaction.save();

    return NextResponse.json({ success: true, data: newTransaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
