import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  transactionId: string;
  userId: string;
  amount: number;
  planType: string;
  planDuration: string;
  status: 'initiated' | 'success' | 'failed' | 'expired';
  paymentMethod: string;
  responseData?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  planType: { type: String, required: true },
  planDuration: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['initiated', 'success', 'failed', 'expired'],
    default: 'initiated'
  },
  paymentMethod: { type: String, required: true, default: 'razorpay', enum: ['razorpay', 'phonepe'] },
  responseData: { type: Schema.Types.Mixed },
}, { 
  timestamps: true 
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema); 