import ReviewsContainer from "@/components/store/profile/reviews/reviews-container";
import { getUserReviews } from "@/api/profile";
import { auth } from "@clerk/nextjs/server";

export default async function ProfileReviewsPage() {
  const { getToken } = auth();
  const token = await getToken();

  if (!token) {
    alert("You are not logged in");
    return;
  }

  const reviews_data = await getUserReviews("", "", "", 1, 10, token);
  const { reviews, totalPages } = reviews_data;
  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Your reviews</h1>
      <ReviewsContainer reviews={reviews} totalPages={totalPages} />
    </div>
  );
}
