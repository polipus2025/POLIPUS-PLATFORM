import { z } from 'zod';

// COMPREHENSIVE VALIDATION SCHEMAS FOR SECURITY

// Authentication validation schemas
export const loginSchema = z.object({
  credentialId: z.string()
    .min(3, 'Credential ID must be at least 3 characters')
    .max(50, 'Credential ID cannot exceed 50 characters')
    .regex(/^[A-Z0-9-_]+$/, 'Invalid credential ID format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password cannot exceed 128 characters')
});

// Farmer data validation schemas
export const farmerCreationSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Invalid characters in first name'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Invalid characters in last name'),
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email cannot exceed 100 characters'),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  county: z.string()
    .min(1, 'County is required')
    .max(50, 'County name too long'),
  district: z.string()
    .min(1, 'District is required')
    .max(50, 'District name too long'),
  village: z.string()
    .min(1, 'Village is required')
    .max(50, 'Village name too long'),
  farmSize: z.number()
    .min(0.01, 'Farm size must be greater than 0')
    .max(10000, 'Farm size seems unrealistic'),
  primaryCrop: z.string()
    .min(1, 'Primary crop is required')
    .max(50, 'Primary crop name too long'),
  secondaryCrops: z.string()
    .max(200, 'Secondary crops description too long')
    .optional(),
  gpsCoordinates: z.string()
    .regex(/^-?\d+\.?\d*,\s*-?\d+\.?\d*$/, 'Invalid GPS coordinates format')
    .optional(),
  farmBoundaries: z.any().optional(), // Complex GeoJSON structure
  landMapData: z.any().optional()     // Complex mapping data
});

// Harvest schedule validation
export const harvestScheduleSchema = z.object({
  cropType: z.string()
    .min(1, 'Crop type is required')
    .max(50, 'Crop type name too long'),
  plantingDate: z.string()
    .datetime('Invalid planting date format'),
  expectedHarvestDate: z.string()
    .datetime('Invalid harvest date format'),
  estimatedQuantity: z.number()
    .min(0.01, 'Quantity must be greater than 0')
    .max(100000, 'Quantity seems unrealistic'),
  unit: z.enum(['kg', 'tons', 'bags', 'sacks'], {
    errorMap: () => ({ message: 'Invalid unit' })
  }),
  qualityGrade: z.enum(['Premium', 'Grade A', 'Grade B', 'Standard'], {
    errorMap: () => ({ message: 'Invalid quality grade' })
  }).optional(),
  notes: z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
});

// Marketplace listing validation
export const marketplaceListingSchema = z.object({
  productName: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name too long'),
  quantity: z.number()
    .min(0.01, 'Quantity must be greater than 0')
    .max(100000, 'Quantity seems unrealistic'),
  unit: z.enum(['kg', 'tons', 'bags', 'sacks']),
  pricePerUnit: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(100000, 'Price seems unrealistic'),
  currency: z.enum(['USD', 'LRD'], {
    errorMap: () => ({ message: 'Only USD and LRD currencies supported' })
  }),
  qualityGrade: z.enum(['Premium', 'Grade A', 'Grade B', 'Standard']),
  harvestDate: z.string()
    .datetime('Invalid harvest date format'),
  expiryDate: z.string()
    .datetime('Invalid expiry date format'),
  location: z.string()
    .min(1, 'Location is required')
    .max(100, 'Location name too long'),
  description: z.string()
    .max(1000, 'Description too long')
    .optional(),
  certifications: z.array(z.string())
    .max(10, 'Too many certifications')
    .optional()
});

// Transaction proposal validation
export const transactionProposalSchema = z.object({
  buyerId: z.string()
    .min(1, 'Buyer ID is required'),
  listingId: z.number()
    .int('Listing ID must be an integer')
    .positive('Invalid listing ID'),
  proposedQuantity: z.number()
    .min(0.01, 'Quantity must be greater than 0'),
  proposedPricePerUnit: z.number()
    .min(0.01, 'Price must be greater than 0'),
  deliveryDate: z.string()
    .datetime('Invalid delivery date format'),
  paymentTerms: z.enum(['immediate', 'on_delivery', '30_days'], {
    errorMap: () => ({ message: 'Invalid payment terms' })
  }),
  additionalNotes: z.string()
    .max(500, 'Notes too long')
    .optional()
});

// GPS/Location validation
export const gpsCoordinatesSchema = z.object({
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  accuracy: z.number()
    .min(0, 'Accuracy cannot be negative')
    .optional()
});

// Satellite analysis validation
export const satelliteAnalysisSchema = z.object({
  plotId: z.string()
    .min(1, 'Plot ID is required'),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180)
  }),
  analysisType: z.enum(['deforestation', 'crop_health', 'land_use'], {
    errorMap: () => ({ message: 'Invalid analysis type' })
  })
});

// Generic validation helper
export function validateRequest<T>(schema: z.ZodSchema<T>, data: any): { success: boolean; data?: T; errors?: any } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      };
    }
    return { success: false, errors: [{ field: 'unknown', message: 'Validation failed' }] };
  }
}

// Middleware for request validation
export function validateRequestMiddleware<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    const validation = validateRequest(schema, req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }
    
    // Store validated data
    req.validatedBody = validation.data;
    next();
  };
}