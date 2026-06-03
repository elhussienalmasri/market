import OrderStatusTag from "@/components/shared/order-status";
import { useToast } from "@/components/ui/use-toast";
import { OrderStatus } from "@/lib/types";
import { updateOrderGroupStatus } from "@/api/order";
import { FC, useState } from "react";
import { useSession } from "@clerk/nextjs";

interface Props {
  storeId: string;
  groupId: string;
  status: OrderStatus;
}

const OrderStatusSelect: FC<Props> = ({ groupId, status, storeId }) => {
  const [newStatus, setNewStatus] = useState<OrderStatus>(status);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { session } = useSession();

  const { toast } = useToast();

  const options = Object.values(OrderStatus).filter((s) => s !== newStatus);

  const handleClick = async (selectedStatus: OrderStatus) => {
    const token = await session?.getToken();

    try {
      const response = await updateOrderGroupStatus(
        storeId,
        groupId,
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
        <OrderStatusTag status={newStatus} />
      </div>
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-md shadow-md mt-2 w-[140px]">
          {options.map((option) => (
            <button
              key={option}
              className="w-full flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => handleClick(option)}
            >
              <OrderStatusTag status={option} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderStatusSelect;
