import FollowingContainer from "@/components/store/profile/following/container";
import { getUserFollowedStores } from "@/api/profile";
import { auth } from "@clerk/nextjs/server";

export default async function ProfileFollowingPage({
  params,
}: {
  params: { page: string };
}) {
  const page = params.page ? Number(params.page) : 1;
  const { getToken } = auth();
  const token = await getToken();

  if (!token) {
    alert("You are not logged in");
    return;
  }

  const res = await getUserFollowedStores(page, 10, token);
  return (
    <div className="bg-white py-4 px-6">
      <h1 className="text-lg mb-3 font-bold">Stores you follow</h1>
      <FollowingContainer
        stores={res.stores}
        page={page}
        totalPages={res.totalPages}
      />
    </div>
  );
}
