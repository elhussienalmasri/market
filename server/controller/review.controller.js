import { Product, Review, ReviewImage } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const upsertReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.auth;

    const user = await User.findOne({ clerkId: req.auth.userId });
    const id = user._id;
    const {
      variant,
      review,
      rating,
      color,
      size,
      quantity,
      images = [],
    } = req.body.review;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    let existingReview = await Review.findOne({
      productId,
      userId: id,
    });

    let reviewDoc;

    if (existingReview) {
      // Delete old images
      await ReviewImage.deleteMany({
        _id: { $in: existingReview.images },
      });

      // Create new images
      const createdImages = await ReviewImage.insertMany(
        images.map((img) => ({
          url: img.url,
          reviewId: existingReview,
        })),
      );

      existingReview.variant = variant;
      existingReview.review = review;
      existingReview.rating = rating;
      existingReview.color = color;
      existingReview.size = size;
      existingReview.quantity = quantity;
      existingReview.images = createdImages.map((img) => img._id);

      reviewDoc = await existingReview.save();
    } else {
      reviewDoc = await Review.create({
        variant,
        review,
        rating,
        color,
        size,
        quantity,
        productId,
        userId: id,
      });

      const createdImages = await ReviewImage.insertMany(
        images.map((img) => ({
          url: img.url,
          reviewId: reviewDoc._id,
        })),
      );
    }

    await reviewDoc.populate([
      {
        path: "images",
      },
      {
        path: "userId",
      },
    ]);

    // Calculate average rating
    const productReviews = await Review.find({ productId }, { rating: 1 });

    const totalRating = productReviews.reduce(
      (sum, item) => sum + item.rating,
      0,
    );

    const averageRating =
      productReviews.length > 0 ? totalRating / productReviews.length : 0;

    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      numReviews: productReviews.length,
    });

    return res.status(200).json(reviewDoc);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
