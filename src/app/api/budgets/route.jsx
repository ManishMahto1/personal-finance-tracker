import { NextResponse } from "next/server";
import connectDB from "@/app/lib/dbConnect";
import Budget from "@/app/models/Budget";
import mongoose from 'mongoose';

// POST: Create/Update budget
export async function POST(req) {
  try {
    await connectDB();
    const { category, budget, month } = await req.json();

    // Validate required fields
    if (!category || budget === undefined || !month) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate month format
    if (typeof month !== 'string' || !/^\d{4}-\d{2}$/.test(month)) {
        return NextResponse.json(
            { success: false, error: "Invalid month format. Must be திறன்-MM" },
            { status: 400 }
        );
    }

    // Parse month/year from திறன்-MM format
    const [yearValue, monthValue] = month.split('-').map(Number);
    if(isNaN(yearValue) || isNaN(monthValue)){
        return NextResponse.json(
            { success: false, error: "Invalid month or year values" },
            { status: 400 }
        );
    }

    // Check for existing budget
    const existingBudget = await Budget.findOne({
      category,
      month: monthValue,
      year: yearValue
    });

    // Update or create new budget
    let result;
    if (existingBudget) {
      existingBudget.budget = parseFloat(budget);
      result = await existingBudget.save();
    } else {
      result = await Budget.create({
        category,
        budget: parseFloat(budget),
        month: monthValue,
        year: yearValue
      });
    }

    return NextResponse.json(
      { success: true, data: result },
      { status: existingBudget ? 200 : 201 }
    );

  } catch (error) {
    console.error("Budget Error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      // Handle Mongoose validation errors
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
// GET: Fetch all budgets
export async function GET() {
  try {
    await connectDB();
    const budgets = await Budget.find({});
    return NextResponse.json({ success: true, data: budgets });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
// PUT: Update budget (add this to your API route)
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Budget ID required" },
        { status: 400 }
      );
    }

    const deleted = await Budget.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Budget not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deleted },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}