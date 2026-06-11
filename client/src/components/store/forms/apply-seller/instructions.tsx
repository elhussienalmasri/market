import { Dot, Info } from "lucide-react";

export default function Instructions() {
  return (
    <div className="h-[calc(100vh-64px)] bg-teal-100 border-t-4 border-teal-500 text-teal-900 px-4 py-3 shadow-md">
      <div className="flex">
        <div className="me-1">
          <Info className="stroke-teal-500" />
        </div>
        <div>
          <p className="font-bold">Instructions</p>
          {instructions.map((inst, index) => (
            <div key={index} className="flex gap-x-1 mt-1">
              <Dot className="w-4" />
              <p className="text-sm">{inst.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const instructions = [
  {
    info: 'Use an actual photo for your profile picture. To update it, click the image, then choose "Manage Account."',
  },
  {
    info: "Make sure your first and last names are real to help ensure approval.",
  },
  {
    info: "Ensure your email address is accurate. We will use it for important updates.",
  },
  {
    info: "Provide a valid phone number so customers may contact you if needed.",
  },
  {
    info: "Set your store logo and cover photo to make it more appealing to customers.",
  },
  {
    info: "Specify default shipping details like service, cost, and delivery time for smoother orders.",
  },
  {
    info: "Include a clear return policy to build confidence and prevent disputes.",
  },
  {
    info: "Double-check your store URL to ensure it works and is easy to locate.",
  },
  {
    info: "Enter a detailed store description highlighting your products and what makes your store unique.",
  },
  {
    info: "Complete the default shipping fee fields carefully to prevent issues during order processing.",
  },
  {
    info: "Provide a realistic delivery time range to create clear expectations for customers.",
  },
  {
    info: "Review all details before submitting to ensure everything is accurate and ready for approval.",
  },
];
