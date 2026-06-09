import mongoose from 'mongoose';

const atsCheckSchema = new mongoose.Schema(
  { label: String, pass: Boolean, note: String },
  { _id: false }
);

const suggestionSchema = new mongoose.Schema(
  { area: String, before: String, after: String, why: String },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobTitle: { type: String, default: '' },
    matchSummary: { type: String, default: '' },
    score: { type: Number, min: 0, max: 100, required: true },
    strongKeywords: { type: [String], default: [] },
    missingKeywords: { type: [String], default: [] },
    atsChecks: { type: [atsCheckSchema], default: [] },
    suggestions: { type: [suggestionSchema], default: [] },
    resumeText: { type: String, default: '' },
    jdText: { type: String, default: '' },
  },
  { timestamps: true }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Analysis', analysisSchema);
