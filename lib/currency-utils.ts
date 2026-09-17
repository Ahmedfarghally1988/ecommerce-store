/**
 * Central conversion utility.
 * Base price should always be the price stored in the database.
 * The exchangeRate should be the rate of the target currency.
 */
export function convertPrice(basePrice: number | string, exchangeRate: number | string): number {
  return Number(basePrice) / Number(exchangeRate);
}
