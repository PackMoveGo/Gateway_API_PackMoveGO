import { Request, Response } from 'express';
import Contact from '../models/contactModel';
import { consoleLogger } from '../util/console-logger';

/**
 * Submit a contact form
 * POST /v0/contact/submit
 */
export const submitContactForm=async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message, preferredContact }=req.body;
    
    // Validation
    const errors: string[]=[];
    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      errors.push('Please provide a valid email address');
    }
    if (!message || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    if (phone && !/^[\d\s\-\(\)\+]+$/.test(phone)) {
      errors.push('Please provide a valid phone number');
    }
    
    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
      return;
    }
    
    // Create contact submission
    const contact=new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      subject: subject?.trim(),
      message: message.trim(),
      preferredContact: preferredContact || 'any',
      status: 'new',
      source: 'website',
      ipAddress: req.ip || req.headers['x-forwarded-for'] as string,
      userAgent: req.headers['user-agent']
    });
    
    await contact.save();
    
    consoleLogger.info('contact', 'New contact form submission', {
      contactId: contact._id,
      email: contact.email
    });
    
    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We\'ll get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email
      }
    });
  } catch (error) {
    consoleLogger.error('contact', 'Failed to submit contact form', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all contact submissions (admin only)
 * GET /v0/contact/submissions
 */
export const getAllContacts=async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, limit=50, page=1 }=req.query;
    
    const query: any={};
    if (status) {
      query.status=status;
    }
    
    const contacts=await (Contact.find as any)(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();
    
    const total=await Contact.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    consoleLogger.error('contact', 'Failed to get contacts', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update contact status (admin only)
 * PUT /v0/contact/submissions/:id
 */
export const updateContactStatus=async (req: Request, res: Response): Promise<void> => {
  try {
    const { id }=req.params;
    const { status, notes }=req.body;
    
    const updateData: any = { status, notes };
    if (status==='contacted') {
      updateData.respondedAt=new Date();
    }
    
    const contact=await (Contact.findByIdAndUpdate as any)(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact
    });
  } catch (error) {
    consoleLogger.error('contact', 'Failed to update contact', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export default {
  submitContactForm,
  getAllContacts,
  updateContactStatus
};

