const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ featured: true });
  res.status(200).json({ products, numberOfHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, name, company, sort, field, numericFilters } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (company) {
    queryObject.company = company;
  }
  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "<=": "$lt",
      "<=": "$lte",
      "=": "$eq",
    };
    const regEx = /\b(<|<=|>|>=|=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const optionsForFields = ["price", "rating"];
    filters = filters.split(",").forEach((index) => {
      const [field, operator, value] = index.split("-");
      if (optionsForFields.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let filteredList = Product.find(queryObject);
  if (sort) {
    const sortedString = sort.split(",").join(" ");
    filteredList = filteredList.sort(sortedString);
  } else {
    filteredList = filteredList.sort("createdAt");
  }
  if (field) {
    const fieldList = field.split(",").join(" ");
    filteredList = filteredList.select(fieldList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  filteredList = filteredList.skip(skip).limit(limit);

  const products = await filteredList;
  res.status(200).json({ products, numberOfHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
