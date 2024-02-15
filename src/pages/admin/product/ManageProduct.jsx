import { useNavigate, useParams } from "react-router-dom";
import Container from "../../../components/Container";
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CiCirclePlus } from "react-icons/ci";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import useCategory from "@/hooks/useCategory";

const ManageProduct = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setLoader, progress, setProgress, categories, getCategory } =
    useContext(AppContext);
  const { createCategory, newCategory, setNewCategory } = useCategory();

  const { id } = useParams();

  const [files, setFiles] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [updatedProduct, setUpdatedProduct] = useState({});

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const getProductDetails = async (id) => {
    try {
      setProgress(progress + 10);
      setLoader(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ecommerce/products/${id}`);
      setProductDetails([response.data.data]);
      setUpdatedProduct(response.data.data);
      setProgress(progress + 100);
      setLoader(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "error",
        description: err.response.data.message,
      });
      setProgress(progress + 100);
      setLoader(false);
    }
  };
  const handleInputChange = (e, field) => {
    setUpdatedProduct({
      ...updatedProduct,
      [field]: e.target.value,
    });
    setIsSaveDisabled(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFiles([file]);

      const reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("category", updatedProduct.category);
      formData.append("description", updatedProduct.description);
      formData.append("mainImage", files[0]);
      formData.append("name", updatedProduct.name);
      formData.append("price", updatedProduct.price);
      formData.append("stock", updatedProduct.stock);

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/products/${id}`,
        formData,
        { withCredentials: true }
      );
      toast({
        title: "uhh hoo",
        description: response.data.message,
      });
      getProductDetails(id);
      setIsSaveDisabled(true);
    } catch (err) {
      console.error(err.message);
      toast({
        title: "error",
        description: err.response.data.message,
      });
    }
  };

  const deleteProrduct = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/ecommerce/products/${id}
`);
      // console.log(response);
      toast({
        title: "success",
        description: response.data.message,
      });
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast({
        title: "error",
        description: err.response.data.message,
      });
    }
  };

  useEffect(() => {
    getCategory();
    getProductDetails(id);
  }, []);
  return (
    <Container className="flex space-x-4 h-screen justify-center items-center">
      {productDetails.map((product) => (
        <div key={id} className="flex justify-center space-x-5">
          <div className="flex space-x-3">
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-2xl">Product Details</CardTitle>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={deleteProrduct}
                >
                  <MdDelete />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="my-2">
                  <p>ID: {product._id}</p>
                  <p className="text-green-500">stock: {product.stock}</p>
                </div>
                <div className="flex-col space-y-3">
                  <img
                    className="mx-auto w-48 h-52 rounded"
                    src={product.mainImage.url}
                    alt={product.name}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <p className="text-center text-xl">&#8377; {product.price}</p>
              </CardFooter>
            </Card>
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-2xl mb-3 text-center">
                    Manage Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="name" className="my-2">
                    Product name:
                  </Label>
                  <Input
                    id="name"
                    value={updatedProduct.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    placeholder="Enter ur Product Name"
                    required
                  />
                  <Label htmlFor="description" className="my-2">
                    Product description:
                  </Label>
                  <Input
                    id="description"
                    value={updatedProduct.description}
                    onChange={(e) => handleInputChange(e, "description")}
                    placeholder="Enter ur Last Name"
                    required
                  />
                  <Label htmlFor="price" className="my-2">
                    Product price:
                  </Label>
                  <Input
                    label="price"
                    type="number"
                    value={updatedProduct.price}
                    onChange={(e) => handleInputChange(e, "price")}
                    placeholder="enter product price"
                    required
                  />
                  <div className="my-2">
                    <Label htmlFor="category">Product Category:</Label>
                    <div className="flex space-x-3 my-3 rounded">
                      <Select
                        id="category"
                        defaultValue={updatedProduct.category}
                        onValueChange={(value) => {
                          setIsSaveDisabled(false);
                          setUpdatedProduct({
                            ...updatedProduct,
                            category: value,
                          });
                        }}
                        value={product.category}
                        required
                        className="w-full"
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>none</SelectLabel>
                            {categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            type="button"
                            className="text-2xl"
                          >
                            <CiCirclePlus />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-center text-xl">
                              Create Category
                            </DialogTitle>
                          </DialogHeader>
                          <form onSubmit={createCategory}>
                            <div className="grid gap-4 py-4">
                              <Label htmlFor="name">Category name</Label>
                              <Input
                                id="name"
                                value={newCategory}
                                className="col-span-3"
                                onChange={(e) => setNewCategory(e.target.value)}
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit">create</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <Label htmlFor="stock" className="my-2">
                    stock:
                  </Label>
                  <Input
                    label="stock"
                    type="number"
                    value={updatedProduct.stock}
                    onChange={(e) => handleInputChange(e, "stock")}
                    placeholder="Stock"
                    required
                  />
                  <Label htmlFor="mainImage" className="my-2">
                    Main Image:
                  </Label>
                  <Input
                    label="mainImage"
                    type="file"
                    onChange={(e) => {
                      handleFileChange(e);
                      setIsSaveDisabled(false);
                    }}
                    required
                  />
                  <Label htmlFor="preview" className="my-2">
                    Preview:
                  </Label>
                  <img
                    id="preview"
                    src={files.length > 0 ? files[0].preview : ""}
                    alt={files[0]?.name || "Selected Image"}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />{" "}
                </CardContent>
                <CardFooter className="w-full">
                  <Button
                    type="submit"
                    classname=" w-full"
                    onClick={handleSubmit}
                    disabled={isSaveDisabled}
                  >
                    update
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default ManageProduct;
