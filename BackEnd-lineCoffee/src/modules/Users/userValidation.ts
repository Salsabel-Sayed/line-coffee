import Joi from "joi";

export const registerSchema = Joi.object({
  userName: Joi.string().strict().min(3).max(30).required().messages({
    "string.base": "userName must be a string",
    "string.empty": "userName is required",
    "string.min": "userName must be at least 3 characters",
    "any.required": "userName is required",
  }),
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/)
    .required()
    .messages({
      "string.pattern.base":
        "Email must be a valid Gmail or Yahoo ending with .com",
      "any.required": "Email is required",
    }),

  password: Joi.string().strict().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  userPhone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a valid Egyptian number",
      "any.required": "Phone number is required",
    }),
  address: Joi.string().allow('').optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});
