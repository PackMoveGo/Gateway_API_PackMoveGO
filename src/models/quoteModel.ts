import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  fromZip: string;
  toZip: string;
  moveDate: Date;
  rooms: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  moveType?: string;
  estimatedDistance?: number;
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'cancelled';
  quoteAmount?: number;
  notes?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  contactedAt?: Date;
  quotedAt?: Date;
  bookedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema: Schema=new Schema({
  fromZip: {
    type: String,
    required: [true, 'Origin zip code is required'],
    trim: true,
    match: [/^\d{5}$/, 'Please provide a valid 5-digit zip code']
  },
  toZip: {
    type: String,
    required: [true, 'Destination zip code is required'],
    trim: true,
    match: [/^\d{5}$/, 'Please provide a valid 5-digit zip code']
  },
  moveDate: {
    type: Date,
    required: [true, 'Move date is required']
  },
  rooms: {
    type: String,
    required: [true, 'Number of rooms is required'],
    trim: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\s\-\(\)\+]+$/, 'Please provide a valid phone number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  moveType: {
    type: String,
    enum: ['residential', 'commercial', 'apartment', 'office', 'other'],
    default: 'residential'
  },
  estimatedDistance: {
    type: Number,
    min: [0, 'Distance cannot be negative']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'booked', 'cancelled'],
    default: 'new',
    index: true
  },
  quoteAmount: {
    type: Number,
    min: [0, 'Quote amount cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  contactedAt: {
    type: Date
  },
  quotedAt: {
    type: Date
  },
  bookedAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'quotes'
});

// Indexes
quoteSchema.index({ email: 1 });
quoteSchema.index({ phone: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ moveDate: 1 });

// Virtual for full name
quoteSchema.virtual('fullName').get(function(this: IQuote) {
  return `${this.firstName} ${this.lastName}`;
});

export const Quote=mongoose.models.Quote || mongoose.model<IQuote>('Quote', quoteSchema);

export default Quote;

