import slugify from "slugify";

import Brand from "../../../DB/models/brand.model.js";
import Category from "../../../DB/models/category.model.js";
import SubCategories from "../../../DB/models/sub-category.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

export const createBrand = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.user;
  const { subCategoryId } = req.params;

  const isSubCategoryExist = await SubCategories.findById(subCategoryId);

  if (!isSubCategoryExist) {
    return next({ cause: 409, message: "SubCategory is not exist" });
  }

  const isBrandExist = await Brand.findOne({
    name,
    subCategoryId: subCategoryId,
  });

  if (isBrandExist) {
    return next({ cause: 409, message: "Brand is already exist" });
  }

  if (!req.file)
    return next({ cause: 400, message: "Please provide an image" });

  const slug = slugify(name, { lower: true });
  const folderId = slug + "-" + generateUniqueString(5);

  const subCategoryFolder =
    isSubCategoryExist.Image.public_id.split("SubCategory/")[0] +
    "/SubCategory/" +
    isSubCategoryExist.folderId;

  const { public_id, secure_url } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${subCategoryFolder}/Brand/${folderId}`,
    });

  req.folder = `${subCategoryFolder}/Brand/${folderId}`;

  const newBrand = await Brand.create({
    name,
    slug,
    subCategoryId,
    Image: {
      public_id,
      secure_url,
    },
    folderId,
    addedBy: _id,
  });

  req.savedDocuments = { model: Product, _id: newProduct._id };

  res.status(201).json({
    message: "Brand created successfully",
    Brand: newBrand,
  });
};
export const updateBrand = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.user;
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);
  if (!brand) return next({ cause: 404, message: "Brand not found" });

  if (name) {
    const isBrandExist = await Brand.findOne({
      name,
      _id: { $ne: brandId },
    });
    if (isBrandExist) {
      return next({ cause: 409, message: "Brand Name is already exist" });
    }
  }

  const isUserOwnBrand = brand.addedBy.toString() !== _id.toString();
  if (isUserOwnBrand)
    return next({ cause: 403, message: "You are not authorized" });

  let { secure_url: oldSecureUrl, public_id } = brand.Image;

  if (req.file) {
    const folderId = public_id.split("Brand")[0];

    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: `${folderId}Brand/${brand.folderId}`,
      }
    );
    oldSecureUrl = secure_url;
  }
  req.folder = `${folderId}Brand/${brand.folderId}`;

  const updatedBrand = await Brand.findByIdAndUpdate(
    brandId,
    {
      name,
      slug: slugify(name, { lower: true }),
      Image: { secure_url: oldSecureUrl, public_id },
      updatedBy: _id,
    },
    { new: true }
  );

  req.savedDocuments = { model: Brand, _id: updatedBrand._id };

  res.status(200).json({
    message: "Brand updated successfully",
    updatedBrand,
  });
};

export const deleteBrand = async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);
  if (!brand) return next({ cause: 404, message: "Brand not found" });

  await cloudinaryConnection().api.delete_resources_by_prefix(
    `${brand.Image.public_id.split("Brand")[0]}Brand/${brand.folderId}`
  );
  await cloudinaryConnection().api.delete_folder(
    `${brand.Image.public_id.split("Brand")[0]}Brand/${brand.folderId}`
  );

  await Brand.findByIdAndDelete(brandId);

  res.status(200).json({
    message: "Brand deleted successfully",
  });
};

export const getBrandsBySubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params;

  const brands = await Brand.find({ subCategoryId });

  res.status(200).json({
    message: "Brands fetched successfully",
    Brands: brands,
  });
};

export const getBrandsByCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const subCategories = await SubCategories.find({ categoryId });
  const subCategoryIds = subCategories.map((subCategory) => subCategory._id);

  const brands = await Brand.find({ subCategoryId: { $in: subCategoryIds } });

  if (!brands.length) {
    return next({ cause: 404, message: "Brands not found" });
  }

  res.status(200).json({
    message: "Brands fetched successfully",
    Brands: brands,
  });
};
