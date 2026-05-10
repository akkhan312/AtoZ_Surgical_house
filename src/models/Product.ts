import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specifications: { icon: string; label: string }[];
  howToUse: string[];
  reviews: { name: string; time: string; text: string; rating: number }[];
  featured: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    category: { type: String, required: true },
    categoryId: { type: String, required: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    specifications: [{ icon: String, label: String }],
    howToUse: [String],
    reviews: [{ name: String, time: String, text: String, rating: Number }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text search index
ProductSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product: Model<IProduct> = models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
