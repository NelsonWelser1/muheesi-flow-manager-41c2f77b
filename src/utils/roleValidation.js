import { z } from 'zod';

// Validation schemas for role management
export const roleAssignmentSchema = z.object({
  role: z.enum(['sysadmin', 'manager', 'staff'], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role selected"
  }),
  company: z.string()
    .trim()
    .min(1, "Company is required")
    .max(100, "Company name must be less than 100 characters"),
  userId: z.string().uuid("Invalid user ID")
}).refine(
  (data) => {
    // System admins must be assigned to "All Companies"
    if (data.role === 'sysadmin' && data.company !== 'All Companies') {
      return false;
    }
    // Only system admins can be assigned to "All Companies"
    if (data.role !== 'sysadmin' && data.company === 'All Companies') {
      return false;
    }
    return true;
  },
  {
    message: "Invalid role-company combination: System admins must be assigned to 'All Companies', and only system admins can have 'All Companies' access",
    path: ['company']
  }
);

export const pendingRoleChangeSchema = z.object({
  affectedUser: z.string().uuid("Invalid user ID"),
  requestedRole: z.enum(['sysadmin', 'manager', 'staff']),
  requestedCompany: z.string().trim().min(1, "Company is required").max(100),
  justification: z.string()
    .trim()
    .min(10, "Justification must be at least 10 characters")
    .max(500, "Justification must be less than 500 characters")
    .optional()
});

export const reviewSchema = z.object({
  notes: z.string()
    .trim()
    .max(1000, "Review notes must be less than 1000 characters")
    .optional()
});

export const scheduledAssignmentSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(['sysadmin', 'manager', 'staff']),
  company: z.string().trim().min(1, "Company is required").max(100),
  startDate: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      return selectedDate >= new Date();
    },
    { message: "Start date must be in the future" }
  ),
  endDate: z.string().optional().refine(
    (date) => !date || new Date(date) > new Date(),
    { message: "End date must be in the future" }
  ),
  notes: z.string().trim().max(500, "Notes must be less than 500 characters").optional()
}).refine(
  (data) => {
    if (data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ['endDate']
  }
);

export const roleTemplateSchema = z.object({
  name: z.string()
    .trim()
    .min(3, "Template name must be at least 3 characters")
    .max(50, "Template name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Template name can only contain letters, numbers, spaces, hyphens and underscores"),
  description: z.string()
    .trim()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  role: z.enum(['sysadmin', 'manager', 'staff']),
  defaultCompany: z.string().trim().min(1, "Company is required").max(100),
  isActive: z.boolean()
});

export const bulkRoleAssignmentSchema = z.object({
  role: z.enum(['sysadmin', 'manager', 'staff']),
  company: z.string().trim().min(1, "Company is required").max(100),
  userIds: z.array(z.string().uuid()).min(1, "At least one user must be selected")
});

export const csvRowSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  role: z.enum(['sysadmin', 'manager', 'staff'], {
    errorMap: () => ({ message: "Role must be 'sysadmin', 'manager', or 'staff'" })
  }),
  company: z.string().trim().min(1, "Company is required").max(100)
});

// Validation helper functions
export const validateRoleAssignment = (data) => {
  try {
    roleAssignmentSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { 
      success: false, 
      errors: error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {})
    };
  }
};

export const validateScheduledAssignment = (data) => {
  try {
    scheduledAssignmentSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { 
      success: false, 
      errors: error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {})
    };
  }
};

export const validateRoleTemplate = (data) => {
  try {
    roleTemplateSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    return { 
      success: false, 
      errors: error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {})
    };
  }
};

export const validateCsvRow = (row, rowIndex) => {
  try {
    csvRowSchema.parse(row);
    return { success: true, errors: null };
  } catch (error) {
    return { 
      success: false, 
      rowIndex,
      errors: error.errors.map(err => `${err.path[0]}: ${err.message}`)
    };
  }
};

export const validateCsvData = (data) => {
  const errors = [];
  const validRows = [];

  data.forEach((row, index) => {
    const validation = validateCsvRow(row, index + 1);
    if (validation.success) {
      validRows.push(row);
    } else {
      errors.push({
        row: index + 1,
        errors: validation.errors
      });
    }
  });

  return {
    success: errors.length === 0,
    validRows,
    errors
  };
};
