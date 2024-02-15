import { useEffect, useRef, useContext, useState, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import Container from "../../../components/Container";
import axios from "axios";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { CiCirclePlus } from "react-icons/ci";
import { MdContentCopy } from "react-icons/md";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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
import useCategory from "@/hooks/useCategory";
import { TiTick } from "react-icons/ti";
import AdminTable from "@/components/admin/AdminTable";

export const columns = [
  {
    Header: "Category Id",
    accessor: "_id",
    Cell: ({ row }) => {
      const copyRef = useRef(null);
      const [isCopied, setIsCopied] = useState(false);

      const copyToClipboard = () => {
        window.navigator.clipboard.writeText(row.values._id);
        setIsCopied(true);
      };
      return (
        <div className="flex space-x-2">
          <span className="self-center" ref={copyRef}>
            {row.values._id}
          </span>
          <Button variant="ghost" onClick={copyToClipboard}>
            {isCopied ? (
              <TiTick className="self-center text-green-500 w-4 h-4" />
            ) : (
              <MdContentCopy className="self-center" />
            )}
          </Button>
        </div>
      );
    },
  },
  {
    Header: "Category Name",
    accessor: "name",
  },
  {
    Header: "Action",
    accessor: "actions",
    Cell: ({ row }) => {
      const [aOpen, setAopen] = useState(false);
      const [dOpen, setDopen] = useState(false);
      const { toast } = useToast();
      const updatedCategoryRef = useRef("");
      const { progress, setProgress, setLoader, getCategory } =
        useContext(AppContext);
      const updateCategory = async (e) => {
        e.preventDefault();
        try {
          setProgress(progress + 10);
          setLoader(true);
          const data = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/ecommerce/categories/${row.values._id}`,
            { name: updatedCategoryRef.current },
            { withCredentials: true }
          );
          setProgress(progress + 100);
          setLoader(false);
          toast({
            title: "success",
            description: data.data.message,
          });
          getCategory();
          setDopen(false);
        } catch (err) {
          // console.log(err);
          toast({
            title: "error",
            description: err.response.data.message,
          });
          setLoader(false);
          setProgress(progress + 10);
        }
      };

      const deleteCategory = async (e) => {
        e.preventDefault();
        try {
          setProgress(progress + 10);
          setLoader(true);
          const data = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/ecommerce/categories/${row.values._id}`,
            {
              withCredentials: true,
            }
          );
          setProgress(progress + 100);
          setLoader(false);
          toast({
            title: "Success",
            description: data.data.message,
          });
          getCategory();
          setAopen(false);
        } catch (err) {
          toast({
            title: "Error",
            description: err.response.data.message,
          });
          console.log(err);
          setProgress(progress + 100);
          setLoader(false);
        }
      };

      return (
        <div className="flex space-x-3">
          <Dialog open={dOpen} onOpenChange={setDopen}>
            <DialogTrigger asChild>
              <Button>update</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">
                  Update Category
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={updateCategory}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-right">
                      Coupon name
                    </Label>
                    <Input
                      placeholder={row.values.name}
                      id="name"
                      onChange={(e) =>
                        (updatedCategoryRef.current = e.target.value)
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">update</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <AlertDialog open={aOpen} onOpenChange={setAopen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this category and can throw error if u don't delete the
                  corresponding products
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteCategory}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

const Categories = () => {
  const { categories, getCategory, page, dOpen, setDopen } =
    useContext(AppContext);
  const { createCategory, newCategory, setNewCategory } = useCategory();

  useEffect(() => {
    getCategory();
  }, [page]);

  return (
    <Container className="flex space-x-5">
      <AdminSidebar />
      <AdminTable
        columns={columns}
        data={categories}
        cardLabel="Categories"
        inputPlaceholder="Filter categories..."
      />
      <Dialog open={dOpen} onOpenChange={setDopen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="text-4xl">
            <CiCirclePlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Update Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => createCategory(e)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right">
                  Coupon name
                </Label>
                <Input
                  placeholder="enter category name"
                  id="name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Categories;
