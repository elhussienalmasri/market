"use client";

import { useState } from "react";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";

// UI Components
import CategoryDetails from "@/components/dashboard/forms/category-details";
import CustomModal from "@/components/dashboard/shared/custom-modal";
import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";

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

import { BadgeCheck, BadgeMinus, Edit, MoreHorizontal, Trash } from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";

export interface Category {
  _id: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}


//Pass fetchCategories to columns so that child (CellActions) can update parent state after delete or update
export const getColumns = (fetchCategories: () => Promise<void>): ColumnDef<Category>[] => [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => (
      <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
        <Image
          src={row.original.image}
          alt=""
          width={1000}
          height={1000}
          className="w-40 h-40 rounded-full object-cover shadow-2xl"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-extrabold text-lg capitalize">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => <span>/{row.original.url}</span>,
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => (
      <span className="text-muted-foreground flex justify-center">
        {row.original.featured ? <BadgeCheck className="stroke-green-300" /> : <BadgeMinus />}
      </span>
    ),
  },
  {
    id: "actions",
    //  Pass fetchCategories to CellActions for updating parent after actions
    cell: ({ row }) => <CellActions rowData={row.original} fetchCategories={fetchCategories} />,
  },
];


interface CellActionsProps {
  rowData: Category;
  fetchCategories: () => Promise<void>; 
}

const CellActions: React.FC<CellActionsProps> = ({ rowData, fetchCategories }) => {
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!rowData || !rowData._id) return null;

  // Delete handler now calls fetchCategories to refresh table in parent
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/categories/${rowData._id}`);
      await fetchCategories(); // refresh parent table

      toast({
        title: "Deleted category",
        description: "The category has been deleted.",
      });
      setClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error deleting category",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Edit */}
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              // Open modal with CategoryDetails
              setOpen(
                <CustomModal>
                  <CategoryDetails data={{ ...rowData }} fetchCategories={fetchCategories} /> 
                  {/*  Pass fetchCategories to modal so after update table refreshes */}
                </CustomModal>,
                async () => {
                  const response = await axiosInstance.get(`/categories/${rowData._id}`);
                  return { rowData: response.data }; 
                }
              );
            }}
          >
            <Edit size={15} /> Edit Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete */}
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2">
              <Trash size={15} /> Delete category
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation */}
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the category and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={handleDelete} //  Delete calls handleDelete
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};