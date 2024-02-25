import slugify from "slugify";

import SubCategory from "../../../DB/models/sub-category.model.js";
import Category from "../../../DB/models/category.model.js";
import Brand from "../../../DB/models/brand.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

export const createSubCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.user;
  const { categoryId } = req.params;

  const isCategoryExist = await Category.findById(categoryId);
  if (!isCategoryExist) {
    return next({ cause: 409, message: "Category is already exist" });
  }

  const isSubCategoryExist = await SubCategory.findOne({ name });
  if (isSubCategoryExist) {
    return next({ cause: 409, message: "SubCategory is already exist" });
  }

  if (!req.file)
    return next({ cause: 400, message: "Please provide an image" });

  const slug = slugify(name, { lower: true });

  const folderId = slug + "-" + generateUniqueString(5);

  const categoryFolder = isCategoryExist.folderId;

  const { public_id, secure_url } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/Category/${categoryFolder}/SubCategory/${folderId}`,
    });

  req.folder = `${process.env.MAIN_FOLDER}/Category/${categoryFolder}/SubCategory/${folderId}`;

  const newSubCategory = await SubCategory.create({
    name,
    slug,
    categoryId,
    Image: { public_id, secure_url },
    folderId,
    addedBy: _id,
  });

  req.savedDocuments = { model: Brand, _id: newSubCategory._id };

  res.status(201).json({
    message: "Category created successfully",
    SubCategory: newSubCategory,
  });
};

export const updateSubCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.user;
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId);
  if (!subCategory)
    return next({ cause: 404, message: "SubCategory not found" });

  if (name) {
    const isSubCategoryExist = await SubCategory.findOne({
      name,
      _id: { $ne: subCategoryId },
    });
    if (isSubCategoryExist) {
      return next({ cause: 409, message: "SubCategory Name is already exist" });
    }
  }

  let { secure_url: oldSecureUrl, public_id } = subCategory.Image;

  if (req.file) {
    const folderId = public_id.split("SubCategory")[0];

    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.MAIN_FOLDER}/Category/${folderId}/SubCategory/${subCategory.folderId}`,
      }
    );
    req.folder = `${process.env.MAIN_FOLDER}/Category/${folderId}/SubCategory/${subCategory.folderId}`;

    oldSecureUrl = secure_url;
  }

  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    subCategoryId,
    {
      name,
      slug: slugify(name, { lower: true }),
      Image: { secure_url: oldSecureUrl, public_id },
      updatedBy: _id,
    },
    { new: true }
  );

  req.savedDocuments = { model: SubCategory, _id: updatedSubCategory._id };

  res.status(200).json({
    message: "SubCategory updated successfully",
    SubCategory: updatedSubCategory,
  });
};

export const deleteSubCategory = async (req, res, next) => {
  const { subCategoryId } = req.params;

  const subCategory = await SubCategory.findById(subCategoryId).populate(
    "categoryId"
  );

  if (!subCategory)
    return next({ cause: 404, message: "SubCategory not found" });

  const categoryFolder = subCategory.categoryId.folderId;

  await cloudinaryConnection().api.delete_resources_by_prefix(
    `${process.env.MAIN_FOLDER}/Category/${categoryFolder}/SubCategory/${subCategory.folderId}`
  );

  await cloudinaryConnection().api.delete_folder(
    `${process.env.MAIN_FOLDER}/Category/${categoryFolder}/SubCategory/${subCategory.folderId}`
  );

  await Brand.deleteMany({ subCategoryId });
  await SubCategory.findByIdAndDelete(subCategoryId);

  res.status(200).json({
    message: "SubCategory deleted successfully",
  });
};

export const getSubCategories = async (req, res, next) => {
  const { categoryId } = req.params;

  const subCategories = await SubCategory.find({ categoryId }).populate(
    "Brands"
  );

  res.status(200).json({
    SubCategories: subCategories,
  });
};
