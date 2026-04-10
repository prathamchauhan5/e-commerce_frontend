export const getDiscountAmount = (price, discount = 0) => {
  return (price * discount) / 100;
};

export const getDiscountedPrice = (price, discount = 0) => {
  return Number((price - getDiscountAmount(price, discount)).toFixed(2));
};