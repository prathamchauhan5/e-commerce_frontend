const BASE_URL = "https://dummyjson.com";

export const apiClient = async (endpoint, { params = {} } = {}) => {
  const queryString = new URLSearchParams(params).toString();

  const url = queryString
    ? `${BASE_URL}${endpoint}?${queryString}`
    : `${BASE_URL}${endpoint}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
};