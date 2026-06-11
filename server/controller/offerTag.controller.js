import { OfferTag } from "../models/offerTag.model.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";

export const getAllOfferTags = async (req, res) => {
  try {
    const { storeUrl } = req.query;
    let productFilter = {};
    let storeId;

    if (storeUrl) {
      const store = await Store.findOne({ url: storeUrl });

      if (!store) {
        return res.status(200).json([]);
      }
      storeId = store._id;
      productFilter = { storeId };
    }

    const products = await Product.find(productFilter).select("_id");
    const productIds = products.map((p) => p._id);
    const offerTags = await OfferTag.find(
      storeUrl ? { products: { $in: productIds } } : {},
    )
      .populate({
        path: "products",
        select: "_id",
      })
      .lean();

    offerTags.sort(
      (a, b) => (b.products?.length || 0) - (a.products?.length || 0),
    );

    return res.status(200).json(offerTags);
  } catch (error) {
    console.error("OFFER TAG ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const upsertOfferTag = async (req, res) => {
  const { userId } = req.auth;
  try {
    const offerTag = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated." });
    }

    if (user.privateMetadata.role !== "ADMIN") {
      return res.status(403).json({
        error: "Unauthorized Access: Admin Privileges Required for Entry.",
      });
    }

    if (!offerTag.name || !offerTag.url) {
      return res.status(400).json({ error: "Please provide offer tag data." });
    }

    // Check for duplicate name or URL (excluding current tag if _id exists)
    const duplicate = await OfferTag.findOne({
      $or: [{ name: offerTag.name }, { url: offerTag.url }],
      ...(offerTag._id && { _id: { $ne: offerTag._id } }),
    });

    if (duplicate) {
      let errorMessage = "";
      if (duplicate.name === offerTag.name) {
        errorMessage = "An offer tag with the same name already exists";
      } else if (duplicate.url === offerTag.url) {
        errorMessage = "An offer tag with the same URL already exists";
      }
      return res.status(409).json({ error: errorMessage });
    }

    let savedOfferTag;

    if (offerTag._id) {
      savedOfferTag = await OfferTag.findByIdAndUpdate(offerTag._id, offerTag, {
        new: true,
      });
    } else {
      savedOfferTag = await OfferTag.create(offerTag);
    }

    return res.status(200).json(savedOfferTag);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOfferTag = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Please provide offer tag ID." });
  }

  try {
    const offerTag = await OfferTag.findById(id).populate("products");

    if (!offerTag) {
      return res.status(404).json({ error: "Offer tag not found." });
    }

    return res.status(200).json(offerTag);
  } catch (error) {
    console.error("Error in getOfferTag:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOfferTag = async (req, res) => {
  const { id } = req.params;

  try {
    const { userId } = req.auth;

    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated." });
    }

    if (user.privateMetadata.role !== "ADMIN") {
      return res.status(403).json({
        error: "Unauthorized Access: Admin Privileges Required for Entry.",
      });
    }

    if (!id) {
      return res.status(400).json({ error: "Please provide offer tag ID." });
    }

    const deletedTag = await OfferTag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res
        .status(404)
        .json({ error: "Offer tag not found or already deleted." });
    }

    return res
      .status(200)
      .json({ message: "Offer tag deleted successfully.", data: deletedTag });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
