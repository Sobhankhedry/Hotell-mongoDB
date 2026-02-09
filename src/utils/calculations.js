/**
 * Calculation Utilities
 */

/**
 * Calculate tax amount (9%)
 */
function calculateTax(amount) {
  return amount * 0.09;
}

/**
 * Calculate total with tax
 */
function calculateTotalWithTax(amount) {
  return amount * 1.09;
}

/**
 * Calculate food discount based on type
 */
function calculateFoodDiscount(foodType, basePrice) {
  switch (foodType) {
    case 'VIP':
      return basePrice * 0.20; // 20% discount
    case 'Normal':
      return basePrice * 0.10; // 10% discount
    case 'Budget':
      return 0; // No discount
    default:
      return 0;
  }
}

/**
 * Calculate final price with discount and tax
 */
function calculateFinalPrice(basePrice, discount = 0) {
  const discountedPrice = basePrice - discount;
  return calculateTotalWithTax(discountedPrice);
}

/**
 * Calculate stay days between two dates
 */
function calculateStayDays(reserveDate, checkOutDate = null) {
  const endDate = checkOutDate || new Date();
  const diffTime = Math.abs(endDate - new Date(reserveDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculate days since last clean
 */
function calculateDaysSinceClean(lastCleanDate) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(lastCleanDate));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Calculate food popularity score
 */
function calculatePopularityScore(rating, totalOrders, price) {
  return (rating * 10) + (totalOrders * 5) + (price / 100);
}

/**
 * Calculate average
 */
function calculateAverage(values) {
  if (!values || values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Determine if visitor is VIP
 */
function isVIPVisitor(totalFoodOrders, stayDays) {
  return (
    totalFoodOrders > 15 ||
    stayDays > 10 ||
    (totalFoodOrders > 5 && stayDays > 5)
  );
}

/**
 * Calculate age from birth year
 */
function calculateAge(birthYear) {
  return new Date().getFullYear() - birthYear;
}

module.exports = {
  calculateTax,
  calculateTotalWithTax,
  calculateFoodDiscount,
  calculateFinalPrice,
  calculateStayDays,
  calculateDaysSinceClean,
  calculatePopularityScore,
  calculateAverage,
  isVIPVisitor,
  calculateAge
};