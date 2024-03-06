import slugify from "slugify";

import Product from "../../../DB/models/product.model.js";
import Brand from "../../../DB/models/brand.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { APIFeatures } from "../../utils/api-features.js";

export const createProduct = async (req, res, next) => {
  const {
    title,
    description,
    price,
    discount,
    quantity,
    rating,
    specifications,
  } = req.body;

  const { _id } = req.user;

  const { brandId } = req.params;

  const isBrandExist = await Brand.findById(brandId);
  if (!isBrandExist) {
    return next({ cause: 409, message: "Brand is already exist" });
  }

  if (
    req.user.role !== systemRoles.SUPERADMIN &&
    isBrandExist.addedBy.toString() !== addedBy.toString()
  )
    return next({
      cause: 403,
      message: "You are not authorized to add a product to this brand",
    });

  const isProductExist = await Product.findOne({ title });
  if (isProductExist) {
    return next({ cause: 409, message: "Product is already exist" });
  }

  if (!req.files?.length)
    return next({ cause: 400, message: "Please provide at least one image" });

  let images = [];

  const slug = slugify(title, { lower: true, replacement: "-" });

  const folderId = slug + "-" + generateUniqueString(4);

  const appliedPrice = price - (price * (discount || 0)) / 100;

  const folderPath = isBrandExist.Image.public_id.split(
    `${isBrandExist.folderId}`
  )[0];

  for (const file of req.files) {
    const { public_id, secure_url } =
      await cloudinaryConnection().uploader.upload(file.path, {
        folder: `${folderPath}${isBrandExist.folderId}/Product/${folderId}`,
      });

    images.push({ public_id, secure_url });
  }

  req.folder = `${folderPath}${isBrandExist.folderId}/Product/${folderId}`;

  const newProduct = await Product.create({
    title,
    slug,
    description,
    price,
    discount,
    appliedPrice,
    quantity,
    rating,
    specifications: JSON.parse(specifications),
    Image: images,
    folderId,
    addedBy: _id,
    brandId,
  });

  req.savedDocuments = { model: Product, _id: newProduct._id };

  res.status(201).json({
    message: "Product created successfully",
    Product: newProduct,
  });
};

export const updateProduct = async (req, res, next) => {
  const {
    title,
    description,
    price,
    discount,
    quantity,
    rating,
    specifications,
  } = req.body;
  const { _id } = req.user;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next({ cause: 404, message: "Product not found" });

  if (title) {
    const isProductExist = await Product.findOne({
      title,
      _id: { $ne: productId },
    });
    if (isProductExist) {
      return next({ cause: 409, message: "Product Name is already exist" });
    }
  }

  const slug = slugify(title, { lower: true, replacement: "-" });
  let folderId = product.folderId;

  let images = [];
  if (req.files?.length) {
    const filePath = product.Image[0].public_id.split(`${folderId}`)[0];
    await cloudinaryConnection().api.delete_resources_by_prefix(
      `${filePath}${folderId}`
    );
    await cloudinaryConnection().api.delete_folder(`${filePath}${folderId}`);

    folderId = slug + "-" + generateUniqueString(4);

    for (const file of req.files) {
      const { public_id, secure_url } =
        await cloudinaryConnection().uploader.upload(file.path, {
          folder: `${filePath}${folderId}`,
        });
      images.push({ public_id, secure_url });
    }
  }

  req.folder = `${filePath}${folderId}`;

  const appliedPrice = price - (price * (discount || 0)) / 100;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      title,
      slug,
      folderId,
      description,
      price,
      discount,
      appliedPrice,
      quantity,
      rating,
      Image: images.length ? images : product.Image,
      specifications: JSON.parse(specifications),
      updatedBy: _id,
    },
    { new: true }
  );

  req.savedDocuments = { model: Product, _id: updatedProduct._id };

  res.status(200).json({
    message: "Product updated successfully",
    Product: updatedProduct,
  });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next({ cause: 404, message: "Product not found" });

  if (
    req.user.role !== systemRoles.SUPERADMIN &&
    product.addedBy.toString() !== req.user._id.toString()
  )
    return next({
      cause: 403,
      message: "You are not authorized to delete this product",
    });

  const filePath = product.Image[0].public_id.split(`${product.folderId}`)[0];
  await cloudinaryConnection().api.delete_resources_by_prefix(
    `${filePath}${product.folderId}`
  );
  await cloudinaryConnection().api.delete_folder(
    `${filePath}${product.folderId}`
  );

  await Product.findByIdAndDelete(productId);

  res.status(200).json({
    message: "Product deleted successfully",
  });
};

export const getAllProducts = async (req, res, next) => {
  const { brandId } = req.params;
  const { page, size, sort, ...search } = req.query;
  const features = new APIFeatures(req.query, Product.find({ brandId }))
    .sort(sort)
    .pagination({ page, size })
    .search(search)
    .filters(search);
  const products = await features.mongooseQuery;
  res.status(200).json({ success: true, data: products });
};
