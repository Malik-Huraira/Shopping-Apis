// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (basic international format)
const isValidPhoneNumber = (phone) => {
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

// Password strength validation
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Name validation
const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

// Validate signup input
const validateSignupInput = (data) => {
  const errors = [];

  if (!data.name || !isValidName(data.name)) {
    errors.push("Name must be between 2 and 100 characters");
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.password || !isStrongPassword(data.password)) {
    errors.push(
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    );
  }

  if (!data.phone_number || !isValidPhoneNumber(data.phone_number)) {
    errors.push("Invalid phone number format");
  }

  if (data.role && !["admin", "user"].includes(data.role)) {
    errors.push("Invalid role. Allowed: admin, user");
  }

  if (data.status && !["active", "inactive"].includes(data.status)) {
    errors.push("Invalid status. Allowed: active, inactive");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate login input
const validateLoginInput = (data) => {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  if (!data.password || data.password.length === 0) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  isStrongPassword,
  isValidName,
  validateSignupInput,
  validateLoginInput,
};
