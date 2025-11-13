import { Request, Response } from 'express';
import Quote from '../models/quoteModel';
import { consoleLogger } from '../util/console-logger';

/**
 * Submit a quote request
 * POST /v0/quotes/submit
 */
export const submitQuote=async (req: Request, res: Response): Promise<void> => {
  try {
    const { fromZip, toZip, moveDate, rooms, firstName, lastName, phone, email, moveType }=req.body;
    
    // Validation
    const errors: string[]=[];
    if (!fromZip || !/^\d{5}$/.test(fromZip)) {
      errors.push('Please provide a valid 5-digit origin zip code');
    }
    if (!toZip || !/^\d{5}$/.test(toZip)) {
      errors.push('Please provide a valid 5-digit destination zip code');
    }
    if (!moveDate) {
      errors.push('Move date is required');
    }
    if (!rooms) {
      errors.push('Number of rooms is required');
    }
    if (!firstName || firstName.trim().length < 2) {
      errors.push('First name must be at least 2 characters');
    }
    if (!lastName || lastName.trim().length < 2) {
      errors.push('Last name must be at least 2 characters');
    }
    if (!phone || !/^[\d\s\-\(\)\+]+$/.test(phone)) {
      errors.push('Please provide a valid phone number');
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }
    
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
      return;
    }
    
    // Create quote request
    const quote=new Quote({
      fromZip: fromZip.trim(),
      toZip: toZip.trim(),
      moveDate: new Date(moveDate),
      rooms: rooms.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email?.trim().toLowerCase(),
      moveType: moveType || 'residential',
      status: 'new',
      source: 'website',
      ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent']
    });
    
    await quote.save();
    
    consoleLogger.info('quote', 'New quote request submitted', {
      quoteId: quote._id,
      fullName: quote.fullName,
      phone: quote.phone
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you! Your quote request has been submitted. We\'ll contact you soon.',
      data: {
        id: quote._id,
        fullName: quote.fullName,
        moveDate: quote.moveDate
      }
    });
  } catch (error) {
    consoleLogger.error('quote', 'Failed to submit quote request', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quote request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all quote requests (admin only)
 * GET /v0/quotes
 */
export const getAllQuotes=async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, limit=50, page=1 }=req.query;
    
    const query: any={};
    if (status) {
      query.status=status;
    }
    
    const quotes=await (Quote.find as any)(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();
    
    const total=await Quote.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: quotes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    consoleLogger.error('quote', 'Failed to get quotes', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve quotes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update quote status (admin only)
 * PUT /v0/quotes/:id
 */
export const updateQuoteStatus=async (req: Request, res: Response): Promise<void> => {
  try {
    const { id }=req.params;
    const { status, quoteAmount, notes }=req.body;
    
    const updateData: any={ notes };
    if (status) updateData.status=status;
    if (quoteAmount !== undefined) updateData.quoteAmount=quoteAmount;
    if (status==='contacted') updateData.contactedAt=new Date();
    if (status==='quoted') updateData.quotedAt=new Date();
    if (status==='booked') updateData.bookedAt=new Date();
    
    const quote=await (Quote.findByIdAndUpdate as any)(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Quote updated successfully',
      data: quote
    });
  } catch (error) {
    consoleLogger.error('quote', 'Failed to update quote', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quote',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default {
  submitQuote,
  getAllQuotes,
  updateQuoteStatus
};

