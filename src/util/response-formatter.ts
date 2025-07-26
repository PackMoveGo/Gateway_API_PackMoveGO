import { Response } from 'express';

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  timestamp: string;
  path?: string;
  requestId?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: {
    version: string;
    environment: string;
    responseTime?: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: any;
    field?: string;
  };
  timestamp: string;
  path?: string;
  requestId?: string;
}

export class ResponseFormatter {
  private static readonly API_VERSION = '1.0.0';
  private static readonly ENVIRONMENT = process.env.NODE_ENV || 'development';

  /**
   * Send a successful response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200,
    options?: {
      pagination?: {
        page: number;
        limit: number;
        total: number;
      };
      responseTime?: number;
      requestId?: string;
    }
  ): void {
    const response: APIResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: res.req.path,
      requestId: options?.requestId,
      meta: {
        version: this.API_VERSION,
        environment: this.ENVIRONMENT,
        responseTime: options?.responseTime
      }
    };

    if (options?.pagination) {
      const { page, limit, total } = options.pagination;
      response.pagination = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      };
    }

    res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    errorCode: string = 'INTERNAL_ERROR',
    details?: any,
    options?: {
      field?: string;
      requestId?: string;
    }
  ): void {
    const errorResponse: ErrorResponse = {
      success: false,
      message,
      error: {
        code: errorCode,
        details,
        field: options?.field
      },
      timestamp: new Date().toISOString(),
      path: res.req.path,
      requestId: options?.requestId
    };

    res.status(statusCode).json(errorResponse);
  }

  /**
   * Send a validation error response
   */
  static validationError(
    res: Response,
    errors: Array<{ field: string; message: string; value?: any }>,
    requestId?: string
  ): void {
    this.error(
      res,
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      errors,
      { requestId }
    );
  }

  /**
   * Send a not found response
   */
  static notFound(
    res: Response,
    resource: string = 'Resource',
    requestId?: string
  ): void {
    this.error(
      res,
      `${resource} not found`,
      404,
      'NOT_FOUND',
      undefined,
      { requestId }
    );
  }

  /**
   * Send an unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access',
    requestId?: string
  ): void {
    this.error(
      res,
      message,
      401,
      'UNAUTHORIZED',
      undefined,
      { requestId }
    );
  }

  /**
   * Send a forbidden response
   */
  static forbidden(
    res: Response,
    message: string = 'Access forbidden',
    requestId?: string
  ): void {
    this.error(
      res,
      message,
      403,
      'FORBIDDEN',
      undefined,
      { requestId }
    );
  }

  /**
   * Send a rate limit exceeded response
   */
  static rateLimitExceeded(
    res: Response,
    retryAfter?: number,
    requestId?: string
  ): void {
    const headers: Record<string, string> = {};
    if (retryAfter) {
      headers['Retry-After'] = retryAfter.toString();
    }

    this.error(
      res,
      'Rate limit exceeded',
      429,
      'RATE_LIMIT_EXCEEDED',
      { retryAfter },
      { requestId }
    );
  }

  /**
   * Send a service unavailable response
   */
  static serviceUnavailable(
    res: Response,
    service: string = 'Service',
    requestId?: string
  ): void {
    this.error(
      res,
      `${service} is temporarily unavailable`,
      503,
      'SERVICE_UNAVAILABLE',
      undefined,
      { requestId }
    );
  }

  /**
   * Send a paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully',
    requestId?: string
  ): void {
    this.success(
      res,
      data,
      message,
      200,
      {
        pagination: { page, limit, total },
        requestId
      }
    );
  }

  /**
   * Send a created response
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully',
    requestId?: string
  ): void {
    this.success(res, data, message, 201, { requestId });
  }

  /**
   * Send a no content response
   */
  static noContent(res: Response): void {
    res.status(204).end();
  }

  /**
   * Send a health check response
   */
  static healthCheck(
    res: Response,
    status: 'ok' | 'degraded' | 'down',
    details?: any
  ): void {
    const response = {
      status,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: this.ENVIRONMENT,
      version: this.API_VERSION,
      ...details
    };

    res.status(status === 'down' ? 503 : 200).json(response);
  }
}

// Convenience functions for common responses
export const sendSuccess = ResponseFormatter.success;
export const sendError = ResponseFormatter.error;
export const sendValidationError = ResponseFormatter.validationError;
export const sendNotFound = ResponseFormatter.notFound;
export const sendUnauthorized = ResponseFormatter.unauthorized;
export const sendForbidden = ResponseFormatter.forbidden;
export const sendRateLimitExceeded = ResponseFormatter.rateLimitExceeded;
export const sendServiceUnavailable = ResponseFormatter.serviceUnavailable;
export const sendPaginated = ResponseFormatter.paginated;
export const sendCreated = ResponseFormatter.created;
export const sendNoContent = ResponseFormatter.noContent;
export const sendHealthCheck = ResponseFormatter.healthCheck; 