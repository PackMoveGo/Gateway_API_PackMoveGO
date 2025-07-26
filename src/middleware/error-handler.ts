import { Request, Response, NextFunction } from 'express';
import { sendError } from '../util/response-formatter';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  details?: any;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends CustomError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends CustomError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(service: string = 'Service') {
    super(`${service} is temporarily unavailable`, 503, 'SERVICE_UNAVAILABLE');
  }
}

// Error handler middleware
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = req.headers['x-request-id'] as string;
  const timestamp = new Date().toISOString();
  const path = req.path;
  const method = req.method;
  const userAgent = req.get('User-Agent');
  const ip = req.ip || req.socket.remoteAddress;

  // Log error details
  console.error('❌ API Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500,
    code: err.code || 'INTERNAL_ERROR',
    path,
    method,
    ip,
    userAgent,
    timestamp,
    requestId
  });

  // Handle specific error types
  if (err instanceof CustomError) {
    sendError(res, err.message, err.statusCode, err.code, err.details, {
      requestId
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    sendError(res, 'Validation failed', 400, 'VALIDATION_ERROR', err.message, {
      requestId
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401, 'INVALID_TOKEN', undefined, {
      requestId
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401, 'TOKEN_EXPIRED', undefined, {
      requestId
    });
    return;
  }

  // Handle MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    if (err.message.includes('duplicate key')) {
      sendError(res, 'Resource already exists', 409, 'DUPLICATE_RESOURCE', undefined, {
        requestId
      });
      return;
    }
    
    sendError(res, 'Database error', 503, 'DATABASE_ERROR', undefined, {
      requestId
    });
    return;
  }

  // Handle syntax errors
  if (err instanceof SyntaxError) {
    sendError(res, 'Invalid request format', 400, 'INVALID_FORMAT', undefined, {
      requestId
    });
    return;
  }

  // Handle timeout errors
  if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
    sendError(res, 'Request timeout', 408, 'TIMEOUT', undefined, {
      requestId
    });
    return;
  }

  // Handle network errors
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    sendError(res, 'Service unavailable', 503, 'SERVICE_UNAVAILABLE', undefined, {
      requestId
    });
    return;
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  const code = err.code || 'INTERNAL_ERROR';

  // Don't expose internal errors in production
  const details = process.env.NODE_ENV === 'development' ? {
    stack: err.stack,
    name: err.name
  } : undefined;

  sendError(res, message, statusCode, code, details, {
    requestId
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || 
                   req.headers['x-correlation-id'] || 
                   `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  req.headers['x-request-id'] = requestId as string;
  res.setHeader('X-Request-ID', requestId);
  
  next();
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response) => {
  const requestId = req.headers['x-request-id'] as string;
  
  sendError(res, 'Endpoint not found', 404, 'NOT_FOUND', {
    path: req.path,
    method: req.method,
    availableEndpoints: [
      '/api/health',
      '/api/v1/services',
      '/api/v1/services/:serviceId',
      '/api/v1/services/:serviceId/quote',
      '/api/v1/services/analytics',
      '/v0/blog',
      '/v0/about',
      '/v0/nav',
      '/v0/contact',
      '/v0/referral',
      '/v0/reviews',
      '/v0/locations',
      '/v0/supplies',
      '/v0/services',
      '/v0/testimonials'
    ]
  }, { requestId });
};

 