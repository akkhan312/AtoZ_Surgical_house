import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderId: string;
  items: { productId: string; name: string; price: number; qty: number; image: string }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  estimatedArrival?: string;
  trackingNumber?: string;
  placedAt: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, unique: true },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: { type: String, default: 'New York, NY 10001' },
    paymentMethod: { type: String, default: 'Credit Card' },
    estimatedArrival: { type: String },
    trackingNumber: { type: String },
    placedAt: { type: String },
  },
  { timestamps: true }
);

// Auto-generate orderId before save
OrderSchema.pre('save', function () {
  if (!this.orderId) {
    this.orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  }
  if (!this.placedAt) {
    this.placedAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
});

const Order: Model<IOrder> = models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
