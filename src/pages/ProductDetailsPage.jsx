import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import { CiHeart } from "react-icons/ci";
import { IoHeartSharp } from "react-icons/io5";
import Container from "../components/Container";
import useCart from "../hooks/useCart";
import { Spinner } from "../components";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

const ProductDetails = () => {
  const { addToCart, loader, setLoader } = useCart();
  const { id } = useParams();
  const {
    wishList,
    addToWish,
    removeFromWish,
    getProducts,
    cartProducts,
    setProgress,
    progress,
  } = useContext(AppContext);

  const [productDetails, setProductDetails] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [productCategory, setProductCategory] = useState([]);
  const [category, setCategory] = useState("");

  const getProductDetails = async (id) => {
    try {
      setProgress(progress + 10);
      setLoader(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/products/${id}`
      );
      setProductDetails([response.data.data]);
      // console.log(response.data.data.category);
      setCategoryId(response.data.data.category);
      setProgress(progress + 100);
      setLoader(false);
    } catch (err) {
      toast.error(err.message);
      setProgress(progress + 100);
      setLoader(false);
    }
  };

  const similarProducts = async (categoryId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/products/category/${categoryId}?page=1&limit=5`
      );
      setProductCategory(response.data.data.products);
      setCategory(response.data.data.category.name);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getProductDetails(id);
    if (categoryId) {
      similarProducts(categoryId);
    }
  }, [id, categoryId]);

  useEffect(() => {
    getProducts();
    getProductDetails(id);
  }, []);
  return (
    <>
      <Container>
        {productDetails.map((item, index) => (
          <div key={index}>
            <section className="text-gray-600 body-font overflow-hidden">
              <div className="container px-5 py-24 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                  <img
                    alt="ecommerce"
                    className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
                    src={item.mainImage && item.mainImage.url}
                  />
                  <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                    <h2 className="text-sm title-font text-gray-500 tracking-widest">
                      {category}
                    </h2>
                    <h1 className="mt-10 scroll-m-20 border-b pb-2 text-3xl text-white font-semibold tracking-tight transition-colors first:mt-0">
                      {item.name}
                    </h1>
                    <div className="flex mb-4">
                      <span className="flex items-center">
                        <svg
                          fill="currentColor"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-4 h-4 text-indigo-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          fill="currentColor"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-4 h-4 text-indigo-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          fill="currentColor"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-4 h-4 text-indigo-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          fill="currentColor"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-4 h-4 text-indigo-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          className="w-4 h-4 text-indigo-500"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-gray-600 ml-3">4 Reviews</span>
                      </span>
                    </div>
                    <p className="leading-7 [&:not(:first-child)]:mt-6 text-slate-200">
                      {item.description}
                    </p>
                    <div className="flex mt-10">
                      <span className="leading-7 text-2xl [&:not(:first-child)]:mt-6 text-white">
                        &#8377;{item.price}
                      </span>
                      {cartProducts.some((item) => item.product._id == id) ? (
                        <Button className="flex ml-auto">
                          <Link to="/cart">Go to cart</Link>
                        </Button>
                      ) : (
                        <Button
                          className="flex ml-auto"
                          onClick={() => addToCart(id)}
                        >
                          {loader ? (
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "Add to cart"
                          )}
                        </Button>
                      )}
                      {wishList.some((item) => item._id === id) ? (
                        <button
                          onClick={() => removeFromWish(id)}
                          className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center ml-4"
                        >
                          <IoHeartSharp className="text-2xl text-gray-600" />
                        </button>
                      ) : (
                        <button
                          onClick={() => addToWish(id)}
                          className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4"
                        >
                          <CiHeart className="text-2xl text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <h1 className="text-2xl -mt-16 mb-5">SIMILAR PRODUCTS</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productCategory.length > 0 ? (
                productCategory.map((item) => (
                  <ProductItem
                    key={item._id}
                    _id={item._id}
                    mainImage={item.mainImage.url}
                    price={item.price}
                    name={item.name}
                  />
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        ))}
        <br />
      </Container>
    </>
  );
};

export default ProductDetails;
