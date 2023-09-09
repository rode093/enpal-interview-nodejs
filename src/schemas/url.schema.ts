import mongoose, { Schema } from "mongoose";
import { IUrl } from "../interfaces/url.interface";

export const UrlSchema = new Schema<IUrl>({
  slug: { type: String, required: true, unique: true },
  redirect_url: { type: String, required: true },
});

UrlSchema.index({ slug: 1 });

export const UrlModel = mongoose.model("Urls", UrlSchema);
