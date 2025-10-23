import { SubCategory } from "../models/subCategory.model.js";

//  Helper: check admin privileges
const checkAdmin = (req) => {
  if (!req.user) throw new Error("Unauthenticated.");
  if (req.user.role !== "ADMIN")
    throw new Error("Unauthorized Access: Admin Privileges Required for Entry.");
};

// Upsert SubCategory (create or update)
export const upsertSubCategory = async (req, res) => {
  try {
    const subCategory = req.body;
    if (!subCategory) throw new Error("Please provide subCategory data.");

    // Check for duplicates by name or url (excluding current id)
    const existingSubCategory = await SubCategory.findOne({
      $and: [
        {
          $or: [{ name: subCategory.name }, { url: subCategory.url }],
        },
        { _id: { $ne: subCategory._id } },
      ],
    });

    if (existingSubCategory) {
      let errorMessage = "";
      if (existingSubCategory.name === subCategory.name)
        errorMessage = "A SubCategory with the same name already exists";
      else if (existingSubCategory.url === subCategory.url)
        errorMessage = "A SubCategory with the same URL already exists";
      throw new Error(errorMessage);
    }

    let updatedSubCategory;

    if (subCategory._id) {
      // Update existing
      updatedSubCategory = await SubCategory.findByIdAndUpdate(
        subCategory._id,
        subCategory,
        { new: true, runValidators: true }
      );
    } else {
      // Create new — Mongoose will auto-generate _id
      updatedSubCategory = await SubCategory.create(subCategory);
    }

    res.status(200).json(updatedSubCategory);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


//  Get all SubCategories (public)
export const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("categoryId", "name url") // include category details
      .sort({ updatedAt: -1 });

    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single SubCategory (public)
export const getSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Please provide SubCategory ID.");

    const subCategory = await SubCategory.findById(id);
    if (!subCategory) throw new Error("SubCategory not found.");

    res.status(200).json(subCategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Delete SubCategory (admin only)
export const deleteSubCategory = async (req, res) => {
  try {
    checkAdmin(req);

    const { id } = req.params;
    if (!id) throw new Error("Please provide SubCategory ID.");

    const deleted = await SubCategory.findByIdAndDelete(id);
    if (!deleted) throw new Error("SubCategory not found.");

    res.status(200).json({ message: "SubCategory deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Takes optional `limit` (number) and `random` (boolean) from the request query to return a list of subcategories, limited or randomly selected.
export const getSubcategories = async (req, res) => {
  const { limit, random } = req.query;

  const parsedLimit = parseInt(limit) || null;
  const isRandom = random === 'true';

  try {
    if (isRandom) {
      // Use aggregation pipeline to get random documents
      const subcategories = await SubCategory.aggregate([
        { $sample: { size: parsedLimit || 10 } },
      ]);
      return res.json(subcategories);
    }

    // Default sort (by creation date or name)
    const subcategories = await SubCategory.find()
      .sort({ createdAt: -1 }) // or use name: 1 if needed
      .limit(parsedLimit || 0); // 0 = no limit

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
