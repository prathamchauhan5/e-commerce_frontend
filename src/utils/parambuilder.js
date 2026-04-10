export const buildParams = ({
  q,
  skip,
  limit,
  sort,
  minPrice,
  maxPrice,
  rating,
}) => {
  const params = {};

  if (q) params.q = q;

  if (skip !== undefined) params.skip = skip;
  if (limit !== undefined) params.limit = limit;

  if (sort) params.sort = sort;

  if (minPrice !== undefined && minPrice !== "")
    params.minPrice = minPrice;

  if (maxPrice !== undefined && maxPrice !== "")
    params.maxPrice = maxPrice;

  if (rating !== undefined && rating !== "")
    params.rating = rating;

  return params;
};