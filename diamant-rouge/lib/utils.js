/**
 * Utility function to recursively serialize all Date objects and Prisma Decimal values
 * @param {any} obj - The object to serialize
 * @returns {any} - A new object with all Date objects converted to ISO strings and Decimal values to strings
 */
export const serializeData = (obj) => {
  // Handle null/undefined values
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle Date objects
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => serializeData(item));
  }

  // Handle objects
  if (typeof obj === 'object') {
    // Create new object to avoid mutation
    const serialized = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key === 'basePrice' || key === 'additionalPrice' || key === 'price') {
          // Always convert price-related fields to strings to avoid Decimal issues
          serialized[key] = String(obj[key]);
        } else {
          serialized[key] = serializeData(obj[key]);
        }
      }
    }
    return serialized;
  }

  // Return primitive types as is
  return obj;
}; 