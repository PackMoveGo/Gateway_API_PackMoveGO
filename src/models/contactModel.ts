import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  preferredContact?: 'email' | 'phone' | 'any';
  status: 'new' | 'contacted' | 'resolved' | 'spam';
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
  respondedAt?: Date;
  notes?: string;
}

const contactSchema: Schema=new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\(\)\+]+$/, 'Please provide a valid phone number']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  preferredContact: {
    type: String,
    enum: ['email', 'phone', 'any'],
    default: 'any'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'resolved', 'spam'],
    default: 'new',
    index: true
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
  respondedAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  collection: 'contacts'
});

// Indexes
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });

// Virtual for formatted phone
contactSchema.virtual('formattedPhone').get(function(this: IContact) {
  if (!this.phone) return '';
  const cleaned=this.phone.replace(/\D/g, '');
  if (cleaned.length===10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return this.phone;
});

export const Contact=mongoose.models.Contact || mongoose.model<IContact>('Contact', contactSchema);

export default Contact;

