"use client";

import { FC, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryFormSchema } from "@/lib/schemas";

import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../shared/image-upload";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { axiosInstance } from "@/lib/axios";

interface Category {
  _id?: string;
  name: string;
  image: string;
  url: string;
  featured: boolean;
}

interface CategoryDetailsProps {
  data?: Category;
  cloudinary_key: string;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data, cloudinary_key }) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: [{ url: data.image }],
        url: data.url,
        featured: data.featured,
      });
    }
  }, [data, form]);

  // Submit handler using Axios
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      const payload = {
        name: values.name ?? form.getValues("name"),
        url: values.url ?? form.getValues("url"),
        image: values.image?.[0]?.url || "",
        featured: values.featured ?? false,
      };

      const response = await axiosInstance.post("/categories/upsert",
        payload
      );

      const result = response.data;

      toast({
        title: data?._id
          ? "Category updated successfully."
          : `🎉 '${result.name}' created successfully!`,
      });

      if (data?._id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (error: any) {
      console.error("Error saving category:", error);

      const message =
        error.response?.data?.error || error.message || "Something went wrong.";

      toast({
        variant: "destructive",
        title: "Oops!",
        description: message,
      });
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?._id
              ? `Update ${data.name} category information.`
              : "Let's create a new category. You can edit it later anytime."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        cloudinary_key={cloudinary_key}
                        value={field.value.map((img) => img.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange(
                            field.value.filter((img) => img.url !== url)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL */}
              <FormField
                disabled={isLoading}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. electronics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Featured Checkbox */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        // @ts-ignore
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : data?._id
                    ? "Save category information"
                    : "Create category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
