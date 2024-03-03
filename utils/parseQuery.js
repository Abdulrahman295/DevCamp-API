export const parseQuery = (query) => {
  let fields = [];
  let sortBy = "name";
  let page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 10;
  let startIndex = (page - 1) * limit;

  let queryStr = JSON.stringify(query).replace(
    /\b(gt|gte|lt|lte|in|eq)\b/g,
    (match) => `$${match}`
  );

  let parsedQuery = JSON.parse(queryStr);

  if (parsedQuery.select) {
    fields = parsedQuery.select.split(",");
    delete parsedQuery.select;
  }

  if (parsedQuery.sort) {
    sortBy = parsedQuery.sort.split(",").join(" ");
    delete parsedQuery.sort;
  }

  if (parsedQuery.page) {
    delete parsedQuery.page;
  }

  if (parsedQuery.limit) {
    delete parsedQuery.limit;
  }

  return { parsedQuery, fields, sortBy, limit, startIndex };
};
