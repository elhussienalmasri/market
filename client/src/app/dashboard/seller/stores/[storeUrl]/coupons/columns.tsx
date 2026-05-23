import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";

import {
  CopyPlus,
  Edit,
  FilePenLine,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { deleteProduct } from "@/api/product";

import { ColumnDef } from "@tanstack/react-table";

import Link from "next/link";
import { Coupon } from "@/lib/types";
import { getTimeUntil } from "@/lib/utils";
import CustomModal from "@/components/dashboard/shared/custom-modal";
import CouponDetails from "@/components/dashboard/forms/coupon-details";
import { deleteCoupon, getCoupon } from "@/api/coupon";
import { useSession } from "@clerk/nextjs";

export const columns: ColumnDef<Coupon>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      return <span>{row.original.code}</span>;
    },
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      return <span>{row.original.discount}</span>;
    },
  },
  {
    accessorKey: "startDate",
    header: "Starts",
    cell: ({ row }) => {
      return <span>{new Date(row.original.startDate).toDateString()}</span>;
    },
  },
  {
    accessorKey: "endDate",
    header: "Ends",
    cell: ({ row }) => {
      return <span>{new Date(row.original.endDate).toDateString()}</span>;
    },
  },
  {
    accessorKey: "timeLeft",
    header: "Time Left",
    cell: ({ row }) => {
      const { days, hours } = getTimeUntil(row.original.endDate);
      return (
        <span>
          {days} days and {hours} hours
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions coupon={rowData} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  coupon: Coupon;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ coupon }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { session } = useSession();

  const params = useParams<{ storeUrl: string }>();

  // Return null if rowData or rowData.id don't exist
  if (!coupon) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                // Custom modal component
                <CustomModal>
                  {/* Store details component */}
                  <CouponDetails
                    data={{ ...coupon }}
                    storeUrl={params.storeUrl}
                  />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getCoupon(coupon?.id),
                  };
                },
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete coupon
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            coupon.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            // disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              try {
                setLoading(true);

                if (!session) {
                  toast({
                    title: "Unauthorized",
                    description: "You must be logged in.",
                  });
                  return;
                }

                const token = await session.getToken();

                await deleteCoupon(coupon._id, params.storeUrl, token);

                toast({
                  title: "Deleted coupon",
                  description: "The coupon has been deleted.",
                });

                router.refresh();
                setClose();
              } catch (error) {
                console.error(error);

                toast({
                  title: "Error",
                  description: "Something went wrong.",
                });
              } finally {
                setLoading(false);
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
