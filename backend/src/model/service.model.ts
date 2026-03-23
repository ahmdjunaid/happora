import mongoose, { HydratedDocument, Schema } from "mongoose";
import { IService } from "../types/service.types";

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

serviceSchema.index({ title: "text", description: "text" });
serviceSchema.index({ category: 1, location: 1, pricePerDay: 1 });

export const ServiceModel = mongoose.model<IService>("Service", serviceSchema);
export type ServiceDocument = HydratedDocument<IService>;
