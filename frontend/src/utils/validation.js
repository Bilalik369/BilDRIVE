// Form validation utilities
export const validationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
  
    phone: {
      required: "Phone number is required",
      pattern: {
        value: /^[+]?[\d\s\-()]+$/,
        message: "Invalid phone number format",
      },
    },
  
    name: {
      required: "This field is required",
      minLength: {
        value: 2,
        message: "Must be at least 2 characters",
      },
      maxLength: {
        value: 50,
        message: "Must be less than 50 characters",
      },
    },
  
    licenseNumber: {
      required: "License number is required",
      pattern: {
        value: /^[A-Z0-9]{6,12}$/,
        message: "Invalid license number format",
      },
    },
  
    vehiclePlate: {
      required: "License plate is required",
      pattern: {
        value: /^[A-Z0-9\-\s]{2,10}$/i,
        message: "Invalid license plate format",
      },
    },
  }
  
  // Custom validation functions
  export const validatePasswordMatch = (password, confirmPassword) => {
    return password === confirmPassword || "Passwords do not match"
  }
  
  export const validateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
  
    return age >= 18 || "Must be at least 18 years old"
  }
  
  export const validateFutureDate = (date) => {
    const today = new Date()
    const inputDate = new Date(date)
    return inputDate > today || "Date must be in the future"
  }
  
  export const validatePastDate = (date) => {
    const today = new Date()
    const inputDate = new Date(date)
    return inputDate < today || "Date must be in the past"
  }
  
  // Real-time validation helpers
  export const validateEmailFormat = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(email)
  }
  
  export const validatePhoneFormat = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-()]+$/
    return phoneRegex.test(phone)
  }
  
  export const getPasswordStrength = (password) => {
    if (!password) return { score: 0, feedback: [] }
  
    let score = 0
    const feedback = []
  
    // Length check
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("Use at least 8 characters")
    }
  
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Add uppercase letters")
    }
  
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Add lowercase letters")
    }
  
    // Number check
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("Add numbers")
    }
  
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push("Add special characters")
    }
  
    const strength = ["Very Weak", "Weak", "Fair", "Good", "Strong"][score]
    const color = ["red", "red", "yellow", "blue", "green"][score]
  
    return { score, strength, color, feedback }
  }
  
  // Form sanitization
  export const sanitizeInput = (input) => {
    if (typeof input !== "string") return input
  
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .replace(/javascript:/gi, "") // Remove javascript: protocol
  }
  
  export const sanitizePhoneNumber = (phone) => {
    return phone.replace(/[^\d+\-\s()]/g, "")
  }
  
  // Address validation
  export const validateAddress = (address) => {
    if (!address || address.length < 5) {
      return "Address must be at least 5 characters"
    }
    if (address.length > 200) {
      return "Address must be less than 200 characters"
    }
    return true
  }
  
  // Credit card validation (basic)
  export const validateCreditCard = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, "")
  
    if (!/^\d{13,19}$/.test(cleaned)) {
      return "Invalid card number format"
    }
  
    // Luhn algorithm
    let sum = 0
    let isEven = false
  
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cleaned[i])
  
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
  
      sum += digit
      isEven = !isEven
    }
  
    return sum % 10 === 0 || "Invalid card number"
  }
  
  export const validateExpiryDate = (expiry) => {
    const [month, year] = expiry.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1
  
    const expMonth = Number.parseInt(month)
    const expYear = Number.parseInt(year)
  
    if (expMonth < 1 || expMonth > 12) {
      return "Invalid month"
    }
  
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return "Card has expired"
    }
  
    return true
  }
  
  export const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv) || "Invalid CVV"
  }
  