import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    entity: { type: String, required: true },
    action: { type: String, required: true, enum: ["DELETE"] },
    data: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
