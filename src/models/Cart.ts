import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: { productId: string; qty: number; price: number; name: string; image: string }[];
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        qty: { type: Number, default: 1, min: 1 },
        price: Number,
        name: String,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

const Cart: Model<ICart> = models.Cart || mongoose.model<ICart>('Cart', CartSchema);
export default Cart;
