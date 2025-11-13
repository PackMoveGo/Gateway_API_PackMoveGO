import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referrerName: string;
  referrerEmail: string;
  referrerPhone?: string;
  refereeName?: string;
  refereeEmail?: string;
  refereePhone?: string;
  referralCode: string;
  status: 'pending' | 'contacted' | 'converted' | 'expired' | 'invalid';
  rewardAmount?: number;
  rewardCurrency?: string;
  rewardStatus?: 'pending' | 'approved' | 'paid' | 'cancelled';
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
  convertedAt?: Date;
  rewardPaidAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const referralSchema: Schema=new Schema({
  referrerName: {
    type: String,
    required: [true, 'Referrer name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  referrerEmail: {
    type: String,
    required: [true, 'Referrer email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    index: true
  },
  referrerPhone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\(\)\+]+$/, 'Please provide a valid phone number']
  },
  refereeName: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  refereeEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  refereePhone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\(\)\+]+$/, 'Please provide a valid phone number']
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted', 'expired', 'invalid'],
    default: 'pending',
    index: true
  },
  rewardAmount: {
    type: Number,
    default: 0,
    min: [0, 'Reward amount cannot be negative']
  },
  rewardCurrency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  rewardStatus: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'cancelled'],
    default: 'pending',
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
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  convertedAt: {
    type: Date
  },
  rewardPaidAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: () => {
      const date=new Date();
      date.setMonth(date.getMonth() + 6); // Expire in 6 months
      return date;
    },
    index: true
  }
}, {
  timestamps: true,
  collection: 'referrals'
});

// Indexes
referralSchema.index({ referrerEmail: 1, createdAt: -1 });
referralSchema.index({ status: 1, createdAt: -1 });
referralSchema.index({ expiresAt: 1 });

// Method to generate unique referral code
referralSchema.static('generateReferralCode', async function() {
  const characters='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code='';
  let isUnique=false;
  
  while (!isUnique) {
    code='';
    for (let i=0; i < 8; i++) {
      code+=characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const existing=await this.findOne({ referralCode: code });
    if (!existing) {
      isUnique=true;
    }
  }
  
  return code;
});

// Check if referral is expired
referralSchema.virtual('isExpired').get(function(this: IReferral) {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

export const Referral=mongoose.models.Referral || mongoose.model<IReferral>('Referral', referralSchema);

export default Referral;

