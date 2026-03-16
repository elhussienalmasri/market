import { redirect } from "next/navigation";
import { getProductBySlug } from "@/api/product";
import { useSession } from "@clerk/nextjs";


export default async function ProductPage({
  params,
}: {
  params: { productSlug: string };
}) {

  const { session } = useSession();
  if (!session) {
    console.error("User not logged in");
    return;
  }

  const token = await session.getToken();

  if (!token) {
    console.error("User not logged in");
    return;
  }

  const product = await getProductBySlug(params.productSlug, token)

  if (!product) {
    return redirect("/");
  }

  if (!product.variants.length) {
    return redirect("/");
  }

  // If the product exists and has variants, redirect to the first variant's page
  return redirect(`/product/${product.slug}/${product.variants[0].slug}`);
}