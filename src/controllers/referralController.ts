import { Request, Response } from 'express';
import Referral from '../models/referralModel';
import { consoleLogger } from '../util/console-logger';

/**
 * Submit a referral
 * POST /v0/referral/submit
 */
export const submitReferral=async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, refereeName, refereeEmail, refereePhone }=req.body;
    
    // Validation
    const errors: string[]=[];
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }
    if (phone && !/^[\d\s\-\(\)\+]+$/.test(phone)) {
      errors.push('Please provide a valid phone number');
    }
    if (refereeEmail && !/^\S+@\S+\.\S+$/.test(refereeEmail)) {
      errors.push('Please provide a valid referee email address');
    }
    
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
      return;
    }
    
    // Generate unique referral code
    const referralCode=await (Referral as any).generateReferralCode();
    
    // Create referral
    const referral=new Referral({
      referrerName: name.trim(),
      referrerEmail: email.trim().toLowerCase(),
      referrerPhone: phone?.trim(),
      refereeName: refereeName?.trim(),
      refereeEmail: refereeEmail?.trim().toLowerCase(),
      refereePhone: refereePhone?.trim(),
      referralCode,
      status: 'pending',
      rewardAmount: 50, // Default reward
      rewardCurrency: 'USD',
      rewardStatus: 'pending',
      source: 'website',
      ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent']
    });
    
    await referral.save();
    
    consoleLogger.info('referral', 'New referral created', {
      referralId: referral._id,
      referralCode: referral.referralCode,
      referrerEmail: referral.referrerEmail
    });
    
    // Generate referral link
    const baseUrl=process.env.FRONTEND_URL || 'https://localhost:5001';
    const referralLink=`${baseUrl}?ref=${referralCode}`;
    
    res.status(201).json({
      success: true,
      message: 'Referral created successfully!',
      data: {
        id: referral._id,
        referralCode: referral.referralCode,
        referralLink,
        referrerName: referral.referrerName,
        referrerEmail: referral.referrerEmail,
        rewardAmount: referral.rewardAmount,
        rewardCurrency: referral.rewardCurrency
      }
    });
  } catch (error) {
    consoleLogger.error('referral', 'Failed to create referral', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create referral',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get referral by code
 * GET /v0/referral/:code
 */
export const getReferralByCode=async (req: Request, res: Response): Promise<void> => {
  try {
    const { code }=req.params;
    
    const referral=await (Referral.findOne as any)({ 
      referralCode: code.toUpperCase() 
    }).lean();
    
    if (!referral) {
      res.status(404).json({
        success: false,
        message: 'Referral code not found'
      });
      return;
    }
    
    // Check if expired
    if (referral.expiresAt && new Date() > referral.expiresAt) {
      res.status(400).json({
        success: false,
        message: 'Referral code has expired'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: {
        referralCode: referral.referralCode,
        referrerName: referral.referrerName,
        rewardAmount: referral.rewardAmount,
        rewardCurrency: referral.rewardCurrency,
        status: referral.status
      }
    });
  } catch (error) {
    consoleLogger.error('referral', 'Failed to get referral', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve referral',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get user's referrals
 * GET /v0/referral/my-referrals
 */
export const getUserReferrals=async (req: Request, res: Response): Promise<void> => {
  try {
    const { email }=req.query;
    
    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required'
      });
      return;
    }
    
    const referrals=await (Referral.find as any)({ referrerEmail: String(email).toLowerCase() })
      .sort({ createdAt: -1 })
      .lean();
    
    // Calculate stats
    const stats={
      total: referrals.length,
      pending: referrals.filter(r => r.status==='pending').length,
      converted: referrals.filter(r => r.status==='converted').length,
      totalRewards: referrals
        .filter(r => r.rewardStatus==='paid')
        .reduce((sum, r) => sum + (r.rewardAmount || 0), 0)
    };
    
    res.status(200).json({
      success: true,
      data: {
        referrals,
        stats
      }
    });
  } catch (error) {
    consoleLogger.error('referral', 'Failed to get user referrals', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve referrals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update referral status (admin only)
 * PUT /v0/referral/:id
 */
export const updateReferralStatus=async (req: Request, res: Response): Promise<void> => {
  try {
    const { id }=req.params;
    const { status, rewardStatus, notes }=req.body;
    
    const updateData: any={ notes };
    if (status) updateData.status=status;
    if (rewardStatus) updateData.rewardStatus=rewardStatus;
    if (status==='converted') updateData.convertedAt=new Date();
    if (rewardStatus==='paid') updateData.rewardPaidAt=new Date();
    
    const referral=await (Referral.findByIdAndUpdate as any)(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!referral) {
      res.status(404).json({
        success: false,
        message: 'Referral not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Referral updated successfully',
      data: referral
    });
  } catch (error) {
    consoleLogger.error('referral', 'Failed to update referral', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update referral',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default {
  submitReferral,
  getReferralByCode,
  getUserReferrals,
  updateReferralStatus
};

