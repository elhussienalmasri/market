import { Size } from "../models/product.model.js";

/**
 * GET filtered sizes
 * Query params: category, subCategory, offer
 */

export const getFilteredSizes = async (req, res) => {
  try {
    const { category, subCategory, offer, limit = 10 } = req.query;

    const pipeline = [
      // Size -> ProductVariant
      {
        $lookup: {
          from: "productvariants",
          localField: "productVariantId",
          foreignField: "_id",
          as: "productVariant",
        },
      },
      {
        $unwind: "$productVariant",
      },

      // ProductVariant -> Product
      {
        $lookup: {
          from: "products",
          let: {
            productId: {
              $toObjectId: "$productVariant.productId",
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$productId"],
                },
              },
            },
          ],
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
    ];

    // Category filter
    if (category) {
      pipeline.push(
        {
          $lookup: {
            from: "categories",
            localField: "product.categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: "$category",
        },
        {
          $match: {
            "category.url": category,
          },
        },
      );
    }

    // SubCategory filter
    if (subCategory) {
      pipeline.push(
        {
          $lookup: {
            from: "subcategories",
            localField: "product.subCategoryId",
            foreignField: "_id",
            as: "subCategory",
          },
        },
        {
          $unwind: "$subCategory",
        },
        {
          $match: {
            "subCategory.url": subCategory,
          },
        },
      );
    }

    // Offer filter
    if (offer) {
      pipeline.push(
        {
          $lookup: {
            from: "offertags",
            localField: "product.offerTag",
            foreignField: "_id",
            as: "offer",
          },
        },
        {
          $unwind: "$offer",
        },
        {
          $match: {
            "offer.url": offer,
          },
        },
      );
    }

    // Get unique sizes
    const sizesData = await Size.aggregate([
      ...pipeline,
      {
        $group: {
          _id: "$size",
        },
      },
      {
        $limit: Number(limit),
      },
    ]);

    const sizeOrderMap = new Map(
      ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
        (size, index) => [size, index],
      ),
    );

    const sizes = sizesData
      .map((item) => item._id)
      .filter(Boolean)
      .sort((a, b) => {
        return (
          (sizeOrderMap.get(a) ?? Infinity) -
            (sizeOrderMap.get(b) ?? Infinity) || a.localeCompare(b)
        );
      });

    const data = {
      sizes: sizes.map((size) => ({ size })),
      count: sizes.length,
    };

    return res.status(200).json({
      sizes: sizes.map((size) => ({ size })),
      count: sizes.length,
    });
  } catch (error) {
    console.error("getFilteredSizes error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
