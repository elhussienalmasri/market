"use client";
import {
  ReviewDateFilter,
  ReviewFilter,
  ReviewWithImageType,
} from "@/lib/types";
import { useEffect, useState } from "react";
import Pagination from "../../shared/pagination";
import { getUserReviews } from "@/api/profile";
import ReviewCard from "../../cards/review";
import ReviewsHeader from "./reviews-header";
import { useSession } from "@clerk/nextjs";

export default async function ReviewsContainer({
  reviews,
  totalPages,
}: {
  reviews: ReviewWithImageType[];
  totalPages: number;
}) {
  const [data, setData] = useState<ReviewWithImageType[]>(reviews);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalDataPages, setTotalDataPages] = useState<number>(totalPages);

  const [filter, setFilter] = useState<ReviewFilter>("");
  // Date period filter
  const [period, setPeriod] = useState<ReviewDateFilter>("");

  // Search filter
  const [search, setSearch] = useState<string>("");

  const { session } = useSession();

  if (!session) {
    alert("You are not logged in");
    return;
  }

  const token = await session.getToken();

  if (!token) {
    alert("You are not logged in");
    return;
  }

  useEffect(() => {
    // Reset to page 1 when filters or search changes
    setPage(1);
  }, [filter, period, search]);

  useEffect(() => {
    const getData = async () => {
      const res = await getUserReviews(filter, period, search, page, 10, token);
      if (res) {
        setData(res.reviews);
        setTotalDataPages(res.totalPages);
      }
    };
    getData();
  }, [page, filter, search, period]);
  return (
    <div>
      <div className="">
        {/* Header */}
        <ReviewsHeader
          filter={filter}
          setFilter={setFilter}
          period={period}
          setPeriod={setPeriod}
          search={search}
          setSearch={setSearch}
        />
        {/* Table */}
        <div className="space-y-2">
          {data.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
      <div className="mt-2">
        <Pagination page={page} setPage={setPage} totalPages={totalDataPages} />
      </div>
    </div>
  );
}
