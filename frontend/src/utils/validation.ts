interface ValidationRule {
  type: 'required' | 'email' | 'password' | 'name' | 'match';
  message: string;
  matchValue?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = (
  formData: Record<string, string>,
  rules: Record<string, ValidationRule[]>
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = formData[field];

    for (const rule of fieldRules) {
      if (rule.type === 'required' && !value) {
        errors[field] = rule.message;
        isValid = false;
        break;
      }

      if (rule.type === 'email' && value && !isValidEmail(value)) {
        errors[field] = rule.message;
        isValid = false;
        break;
      }

      if (rule.type === 'password' && value && !isValidPassword(value)) {
        errors[field] = rule.message;
        isValid = false;
        break;
      }

      if (rule.type === 'name' && value && !isValidName(value)) {
        errors[field] = rule.message;
        isValid = false;
        break;
      }

      if (rule.type === 'match' && rule.matchValue && value !== rule.matchValue) {
        errors[field] = rule.message;
        isValid = false;
        break;
      }
    }
  }

  return { isValid, errors };
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

const isValidName = (name: string): boolean => {
  return name.length >= 2;
}; 