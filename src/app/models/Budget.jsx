import mongoose, { Schema } from 'mongoose';

const budgetSchema = new Schema({
  category: {
    type: String,
    required: true,
    
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  }
});

budgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model('Budget', budgetSchema);