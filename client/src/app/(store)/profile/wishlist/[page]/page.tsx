import WishlistContainer from "@/components/store/profile/wishlist/container";
import { getUserWishlist } from "@/api/profile";
import { auth } from "@clerk/nextjs/server";

export default async function ProfileWishlistPage({
  params,
}: {
  params: { page: string };
}) {
  const page = Number(params.page);
  const { getToken } = auth();
  const token = await getToken();

  if (!token) {
    alert("You are not logged in");
    return;
  }

  const wishlist_data = await getUserWishlist(page, 10, token);
  const { wishlist, totalPages } = wishlist_data;
  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Your Wishlist</h1>
      {wishlist.length > 0 ? (
        <WishlistContainer
          products={wishlist}
          page={page}
          totalPages={totalPages}
        />
      ) : (
        <div>No products</div>
      )}
    </div>
  );
}
