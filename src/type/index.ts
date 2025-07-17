// HTTP Status Codes for PackMoveGO API
export const HTTP_STATUS = {
  // Success Responses
  OK: 200,                    // GET /api/health, GET /api/data/*, GET /
  CREATED: 201,               // POST /api/signup (successful)
  
  // Client Error Responses
  BAD_REQUEST: 400,           // Invalid input, validation errors
  UNAUTHORIZED: 401,          // Missing or invalid authentication
  FORBIDDEN: 403,             // IP whitelist blocked, access denied
  NOT_FOUND: 404,             // API endpoint not found, data file not found
  CONFLICT: 409,              // Email already exists, resource conflict
  TOO_MANY_REQUESTS: 429,     // Rate limit exceeded
  
  // Server Error Responses
  INTERNAL_SERVER_ERROR: 500, // Server errors, JSON parsing errors
  SERVICE_UNAVAILABLE: 503    // MongoDB connection issues
} as const;

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  timestamp: string;
}

export interface Move {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  moveDate: Date;
  status: MoveStatus;
  items: MoveItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface MoveItem {
  id: string;
  name: string;
  quantity: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  weight?: number;
  specialInstructions?: string;
}

export enum MoveStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  customerId: string;
  moveId: string;
  amount: number;
  validUntil: Date;
  status: QuoteStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum QuoteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
} 