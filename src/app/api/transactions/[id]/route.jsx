import connectDB from '@/app/lib/dbConnect';
import Transaction from '@/app/models/Transaction';
import { NextResponse } from 'next/server';

// GET a single transaction by ID
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Await params and destructure
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


// PUT: Update a transaction
export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { amount, date, description,category } = await req.json();
    const { id } = await params; // Await params and destructure

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { amount, date, description,category },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTransaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {  // No destructuring here initially
  try {
    await connectDB();

    const { id } = await params; // Await params and then destructure

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json({ success: false, error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}