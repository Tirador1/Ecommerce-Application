import slugify from "slugify";

import Category from "../../../DB/models/category.model.js";
import SubCategories from "../../../DB/models/sub-category.model.js";
import Brands from "../../../DB/models/brand.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.user;

  const isCategoryExist = await Category.findOne({ name });
  if (isCategoryExist) {
    return next({ cause: 409, message: "Category is already exist" });
  }

  if (!req.file)
    return next({ cause: 400, message: "Please provide an image" });

  const slug = slugify(name, { lower: true });

  const folderId = slug + "-" + generateUniqueString(5);

  const { public_id, secure_url } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/Category/${folderId}`,
    });

  req.folder = `${process.env.MAIN_FOLDER}/Category/${folderId}`;

  const newCategory = await Category.create({
    name,
    slug,
    Image: { public_id, secure_url },
    folderId,
    addedBy: _id,
  });

  req.savedDocuments = { model: SubCategories, _id: newCategory._id };

  res.status(201).json({
    message: "Category created successfully",
    Category: newCategory,
  });
};

export const updateCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.user;
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) return next({ cause: 404, message: "Category not found" });

  if (name) {
    const isCategoryExist = await Category.findOne({
      name,
      _id: { $ne: categoryId },
    });
    if (isCategoryExist) {
      return next({ cause: 409, message: "Category Name is already exist" });
    }
  }

  let { secure_url: oldSecureUrl, public_id } = category.Image;

  if (req.file) {
    const newPublicId = `${process.env.MAIN_FOLDER}/Category/${
      category.folderId
    }/${
      public_id.split(
        `${process.env.MAIN_FOLDER}/Category/${category.folderId}/`
      )[1]
    }`;
    const { secure_url } = await cloudinaryConnection().uploader.upload(
      req.file.path,
      {
        public_id: `${newPublicId}`,
      }
    );
    oldSecureUrl = secure_url;
    req.folder = `${process.env.MAIN_FOLDER}/Category/${category.folderId}`;
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    {
      name: name || category.name,
      slug: name ? slugify(name, { lower: true }) : category.slug,
      Image: {
        secure_url: oldSecureUrl || category.Image.secure_url,
        public_id: public_id || category.Image.public_id,
      },
      updatedBy: _id,
    },
    { new: true }
  );

  req.savedDocuments = { model: Category, _id: updatedCategory._id };

  res.status(200).json({
    message: "Category updated successfully",
    Category: updatedCategory,
  });
};

export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) return next({ cause: 404, message: "Category not found" });

  await cloudinaryConnection().api.delete_resources_by_prefix(
    `${process.env.MAIN_FOLDER}/Category/${category.folderId}`
  );

  await cloudinaryConnection().api.delete_folder(
    `${process.env.MAIN_FOLDER}/Category/${category.folderId}`
  );

  await SubCategories.deleteMany({ categoryId });
  await Brands.deleteMany({ categoryId });

  await Category.findByIdAndDelete(categoryId);

  res.status(200).json({
    message: "Category deleted successfully",
  });
};

export const getCategories = async (req, res, next) => {
  const categories = await Category.find().populate([
    {
      path: "subcategories",
      populate: [
        {
          path: "Brands",
        },
      ],
    },
  ]);

  if (!categories) return next({ cause: 404, message: "No categories found" });

  res.status(200).json({
    message: "Categories fetched successfully",
    Categories: categories,
  });
};
