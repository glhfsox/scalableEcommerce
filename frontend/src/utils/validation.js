export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return re.test(password);
};

export const validateName = (name) => {
  // At least 2 characters, only letters and spaces
  const re = /^[a-zA-Z\s]{2,}$/;
  return re.test(name);
};

export const validatePhone = (phone) => {
  // Basic phone number validation
  const re = /^\+?[\d\s-]{10,}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMinLength = (value, min) => {
  return value && value.length >= min;
};

export const validateMaxLength = (value, max) => {
  return value && value.length <= max;
};

export const validateNumberRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = formData[field];
    const fieldRules = rules[field];

    fieldRules.forEach((rule) => {
      const { type, message, params } = rule;

      let isValid = true;
      switch (type) {
        case 'required':
          isValid = validateRequired(value);
          break;
        case 'email':
          isValid = validateEmail(value);
          break;
        case 'password':
          isValid = validatePassword(value);
          break;
        case 'name':
          isValid = validateName(value);
          break;
        case 'phone':
          isValid = validatePhone(value);
          break;
        case 'minLength':
          isValid = validateMinLength(value, params.min);
          break;
        case 'maxLength':
          isValid = validateMaxLength(value, params.max);
          break;
        case 'numberRange':
          isValid = validateNumberRange(value, params.min, params.max);
          break;
        default:
          break;
      }

      if (!isValid && !errors[field]) {
        errors[field] = message;
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}; 