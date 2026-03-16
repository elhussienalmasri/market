import StoreCard from "@/components/store/cards/store-card";
import AddReviewForm from "@/components/store/forms/add-review";
import ProductPageContainer from "@/components/store/product-page/container";
import ProductDescription from "@/components/store/product-page/product-description";
import ProductQuestions from "@/components/store/product-page/product-questions";
import ProductSpecs from "@/components/store/product-page/product-specs";
import RelatedProducts from "@/components/store/product-page/related-product";
import ProductReviews from "@/components/store/product-page/reviews/product-reviews";
import StoreProducts from "@/components/store/product-page/store-products";
import { Separator } from "@/components/ui/separator";
import { getProductPageData, fetchProducts } from "@/api/product";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

interface PageProps {
  params: { productSlug: string; variantSlug: string };
  searchParams: {
    size?: string;
  };
}

export default async function ProductVariantPage({
  params: { productSlug, variantSlug },
  searchParams: { size: sizeId },
}: PageProps) {

  const { getToken, userId } = auth();

  if (!userId) {
    return <div>You are not logged in.</div>;
  }

  const token = await getToken();

  if (!token) {
    alert("You are not logged in");
    return;
  }
  // Fetch product data based on the product slug and variant slug
  const productData = await getProductPageData(productSlug, variantSlug, token);


  if (!productData) {
    return notFound();
    //return redirect("/");
  }

  const { sizes } = productData;

  // If the size is provided in the URL
  if (sizeId) {
    // Check if the provided sizeId is valid by comparing with available sizes
    const isValidSize = sizes.some((size) => size._id === sizeId);

    // If the sizeId is not valid, redirect to the same product page without the size parameter
    if (!isValidSize) {
      return redirect(`/product/${productSlug}/${variantSlug}`);
    }
  }
  // If no sizeId is provided and there's only one size available, automatically select it
  else if (sizes.length === 1) {
    return redirect(
      `/product/${productSlug}/${variantSlug}?size=${sizes[0]._id}` 
    );
  }

  const {
    productId,
    variantInfo,
    specs,
    questions,
    category,
    store,
    reviewsStatistics,
    reviews,
  } = productData;

  const relatedProducts = await fetchProducts({
    page: 1,
    pageSize: 12,
    sortBy: "",
    filters: {
      category: category.url
    }
  });

  return (
    <div>
      <div className="max-w-[1650px] mx-auto p-4 overflow-x-hidden">
        <ProductPageContainer productData={productData} sizeId={sizeId}>
          {relatedProducts.products && (
            <>
              <Separator />
              {/* Related products */}
              <RelatedProducts products={relatedProducts.products} />
            </>
          )}
          <Separator className="mt-6" />
          {/* Product reviews */}
          <ProductReviews
            productId={productData.productId}
            rating={productData.rating}
            statistics={reviewsStatistics}
            reviews={reviews}
          />
          <div className="mt-3">
            <AddReviewForm productId={productId} variantsInfo={variantInfo} />
          </div>
          <>
            <Separator className="mt-6" />
            {/* Product description */}
            <ProductDescription
              text={[
                productData.description,
                productData.variantDescription || "",
              ]}
            />
          </>
          {(specs.product.length > 0 || specs.variant.length > 0) && (
            <>
              <Separator className="mt-6" />
              {/* Specs table */}
              <ProductSpecs specs={specs} />
            </>
          )}
          {questions.length > 0 && (
            <>
              <Separator className="mt-6" />
              {/* Product Questions */}
              <ProductQuestions questions={productData.questions} />
            </>
          )}
          <Separator className="my-6" />
          {/* Store card */}
          <StoreCard store={productData.store} />
          {/* Store products */}
          <StoreProducts
            storeUrl={store.url}
            storeName={store.name}
            count={5}
          />
        </ProductPageContainer>
      </div>
    </div>
  );
}