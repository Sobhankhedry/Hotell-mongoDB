/**
 * Validation Utilities
 */

/**
 * Validate national code (10 digits)
 */
function isValidNationalCode(code) {
  if (!code || typeof code !== 'string') return false;
  return /^[0-9]{10}$/.test(code);
}

/**
 * Validate phone number (10-12 digits)
 */
function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  return /^[0-9]{10,12}$/.test(phone);
}

/**
 * Validate age (18-120)
 */
function isValidAge(age) {
  return Number.isInteger(age) && age >= 18 && age <= 120;
}

/**
 * Validate date
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date);
}

/**
 * Validate reservation dates
 */
function validateReservationDates(reserveDate, checkOutDate) {
  if (!isValidDate(reserveDate)) {
    return { valid: false, error: 'Invalid reserve date' };
  }

  if (checkOutDate) {
    if (!isValidDate(checkOutDate)) {
      return { valid: false, error: 'Invalid checkout date' };
    }
    if (checkOutDate <= reserveDate) {
      return { valid: false, error: 'Checkout date must be after reserve date' };
    }
  }

  return { valid: true };
}

/**
 * Validate price
 */
function isValidPrice(price) {
  return typeof price === 'number' && price >= 0;
}

/**
 * Validate email
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate room capacity
 */
function isValidRoomCapacity(capacity) {
  return Number.isInteger(capacity) && capacity >= 1;
}

/**
 * Validate room status
 */
function isValidRoomStatus(status) {
  const validStatuses = ['available', 'occupied', 'maintenance', 'cleaning'];
  return validStatuses.includes(status);
}

/**
 * Validate rating (1-5)
 */
function isValidRating(rating) {
  return typeof rating === 'number' && rating >= 1 && rating <= 5;
}

module.exports = {
  isValidNationalCode,
  isValidPhone,
  isValidAge,
  isValidDate,
  validateReservationDates,
  isValidPrice,
  isValidEmail,
  isValidRoomCapacity,
  isValidRoomStatus,
  isValidRating
};