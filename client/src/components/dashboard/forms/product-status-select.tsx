import ProductStatusTag from "@/components/shared/product-status";
import { useToast } from "@/components/ui/use-toast";
import { ProductStatus } from "@/lib/types";
import { updateOrderItemStatus } from "@/api/order";
import { FC, useState } from "react";
import { useSession } from "@clerk/nextjs";

interface Props {
  storeId: string;
  orderItemId: string;
  status: ProductStatus;
}

const ProductStatusSelect: FC<Props> = ({ orderItemId, status, storeId }) => {
  const [newStatus, setNewStatus] = useState<ProductStatus>(status);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { session } = useSession();

  const { toast } = useToast();

  const options = Object.values(ProductStatus).filter((s) => s !== newStatus);

  const handleClick = async (selectedStatus: ProductStatus) => {
    try {
      const token = await session?.getToken();
      const response = await updateOrderItemStatus(
        storeId,
        orderItemId,
        selectedStatus,
        token,
      );
      if (response) {
        setNewStatus(response.status);
        setIsOpen(false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.toString(),
      });
    }
  };
  return (
    <div className="relative">
      {/* Current status */}
      <div
        className="cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ProductStatusTag status={newStatus} />
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-md mt-2 w-[170px]">
          {options.map((option) => (
            <button
              key={option}
              className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => handleClick(option)}
            >
              <ProductStatusTag status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductStatusSelect;
