import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import ProductItem from "../components/ProductItem";

export const AppContext = createContext();

function getLocalWish() {
  let wishes = localStorage.getItem("wish");
  if (wishes) {
    return JSON.parse(wishes);
  } else {
    return [];
  }
}

export default function AppContextProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hastNextPage, setHasNextPage] = useState();
  const [cartProducts, setCartProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState();
  const [wishList, setWishList] = useState(getLocalWish());
  const [couponCode, setCouponCode] = useState("");
  const [disCountedTotal, setDisCountedTotal] = useState();
  const [error, setError] = useState(false);
  const [coupon, setCoupon] = useState(false);
  const [allCoupon, setAllCoupon] = useState([]);
  const [progress, setProgress] = useState(0);
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: Number,
    country: "India",
  });
  const [profileInfo, setProfileInfo] = useState({
    avatar: "",
    email: "",
    username: "",
    role: "",
  });

  const [allAddress, setAllAddress] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(1000);
  const [selectedSort, setSelectedSort] = useState("");
  const [allCoupons, setAllCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cHasNextPage, setChasNextPage] = useState();
  const [dOpen, setDopen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const getProducts = async () => {
    try {
      setProgress(progress + 10);
      setLoader(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/ecommerce/products?page=${page}&limit=12`
      );
      setProducts(response.data.data.products);
      setHasNextPage(response.data.data.hasNextPage);
      setProgress(progress + 100);
      setLoader(false);
    } catch (err) {
      toast.error("Something went wrong while fetching products", err.message);
      setProgress(progress + 100);
      setLoader(false);
    }
  };

  const getCategory = async () => {
    try {
      setLoader(true);
      setProgress(progress + 10);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/ecommerce/categories?page=${page}&limit=15`
      );
      setCategories(response.data.data.categories);
      setHasNextPage(response.data.data.hasNextPage);
      setLoader(false);
      setProgress(progress + 100);
    } catch (err) {
      console.log(err);
      setLoader(false);
      setProgress(progress + 10);
    }
  };

  const addToCart = async (productId) => {
    try {
      if (localStorage.getItem("accessToken")) {
        const cartItems = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ecommerce/cart`,
          {
            withCredentials: true,
          }
        );

        const cartProductIds = cartItems.data.data.items.map(
          (item) => item.product._id
        );

        if (cartProductIds.includes(productId)) {
          toast.success("already added to cart");
        } else {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}${
              import.meta.env.VITE_BACKEND_URL
            }/ecommerce/cart/item/${productId}`,
            {
              withCredentials: true,
            }
          );
          toast.success("Item added to cart");
        }
      } else {
        toast.error("please login to add item in cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("something went wrong");
    }
  };

  const cartItemUpdate = async (id, qty) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/cart/item/${id}`,
        {
          quantity: qty,
        },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getCart = async () => {
    try {
      setLoader(true);
      setProgress(progress + 10);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/cart`,
        {
          withCredentials: true,
        }
      );
      setCartProducts(response.data.data.items);
      setCartTotal(response.data.data.cartTotal);
      setDisCountedTotal(response.data.data.discountedTotal);
      setLoader(false);
      setProgress(progress + 100);
    } catch (err) {
      console.error(err);
      setLoader(false);
      setProgress(progress + 100);
    }
  };

  const cartItemIncrement = async (id, quantity) => {
    try {
      await cartItemUpdate(id, quantity);
      getCart();
    } catch (err) {
      console.log(err);
    }
  };

  const DeleteFromCart = async (id) => {
    try {
      setLoader(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/cart/item/${id}`,
        {
          withCredentials: true,
        }
      );
      getCart();
      setLoader(false);
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoader(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/cart/clear`,
        { withCredentials: true }
      );
      getCart();
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  function addToWish(id) {
    if (localStorage.getItem("accessToken")) {
      const updatedWish = products.find((item) => item._id === id);
      setWishList([...wishList, updatedWish]);
      toast.success("Item added to wishlist");
    } else {
      toast.error("please login add in wishlist");
      setLoader(false);
    }
  }

  function removeFromWish(id) {
    const removeWish = wishList.filter((item) => item._id !== id);
    setWishList(removeWish);
    toast.success("Item removed from wishlist");
  }

  useEffect(() => {
    localStorage.setItem("wish", JSON.stringify(wishList));
  }, [wishList]);

  const getCoupon = async () => {
    try {
      setLoader(true);
      setProgress(progress + 10);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/ecommerce/coupons?page=${page}&limit=15`,
        { withCredentials: true }
      );
      setAllCoupons(response.data.data.coupons);
      setChasNextPage(response.data.data.hasNextPage);
      setLoader(false);
      setProgress(progress + 100);
    } catch (err) {
      toast.error("something went wrong");
      setProgress(progress + 100);
    }
  };

  const availableCoupons = async () => {
    try {
      setLoader(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/ecommerce/coupons/customer/available?page=1&limit=10`,
        {
          withCredentials: true,
        }
      );
      setAllCoupon(response.data.data.coupons);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  const applyCoupon = async (couponCode) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/coupons/c/apply`,
        {
          couponCode: couponCode,
        },
        {
          withCredentials: true,
        }
      );
      setCoupon(true);
      getCart();
      setCouponCode("");
      setError(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
      setError(true);
    }
  };

  const removeCoupon = async (couponCode) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/coupons/c/remove`,
        { couponCode: couponCode },
        { withCredentials: true }
      );
      getCart();
      setCoupon(false);
      setError(false);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  const getAddress = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/addresses`,
        { withCredentials: true }
      );
      setAllAddress(response.data.data.addresses);
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/ecommerce/addresses`,
        address,
        {
          withCredentials: true,
        }
      );
      getAddress();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    availableCoupons();
  }, [cartProducts]);

  const getProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/current-user`,
        { withCredentials: true }
      );
      console.log(response.data.data.avatar.url);
      setProfileInfo({
        avatar: response.data.data.avatar.url,
        email: response.data.data.email,
        username: response.data.data.username,
        role: response.data.data.role,
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  function handleSort(value) {
    setSelectedSort(value);
  }

  function handleCategory(value) {
    setSelectedCategory(value);
  }

  function handleInputChange(e) {
    setQuery(e.target.value);
  }

  function filteredItems(product) {
    return product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  }

  function handlePrice(value) {
    setSelectedPrice(value);
  }

  function filterData(products, selectedPrice, selectedCategory, query) {
    let filteredProducts = products;
    if (query) {
      filteredProducts = filteredProducts.filter(function (product) {
        return product.name.toLowerCase().includes(query.toLowerCase());
      });
    }

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(function (product) {
        return product.category == selectedCategory;
      });
    }
    if (selectedSort === "Sort: Z-A") {
      filteredProducts = filteredProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    } else if (selectedSort === "Sort: A-Z") {
      filteredProducts = filteredProducts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (selectedSort === "Price: Low to High") {
      filteredProducts = filteredProducts.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      );
    } else if (selectedSort === "Price: High to Low") {
      filteredProducts = filteredProducts.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      );
    }

    if (selectedPrice) {
      filteredProducts = filteredProducts.filter(function (product) {
        return product.price <= selectedPrice;
      });
    }

    return filteredProducts.map(function (product) {
      return (
        <ProductItem
          key={product._id}
          _id={product._id}
          name={product.name}
          mainImage={product.mainImage.url}
          price={product.price}
        />
      );
    });
  }

  const result = filterData(products, selectedPrice, selectedCategory, query);

  const handleStatus = (value) => {
    setStatusFilter(value);
  };

  const getOrders = async () => {
    try {
      setProgress(progress + 10);
      setLoader(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/ecommerce/orders/list/admin?status=${statusFilter}&page=${page}&limit=15`,
        { withCredentials: true }
      );

      setOrders(response.data.data.orders);
      setHasNextPage(response.data.data.hasNextPage);
      setProgress(progress + 100);
      setLoader(false);
    } catch (err) {
      console.log(err);
      setProgress(progress + 100);
      setLoader(false);
    }
  };

  useEffect(() => {
    getProfile();
    getCart();
    getOrders();
  }, []);

  useCallback(() => {
    getCart();
  }, [cartProducts, getCart]);
  const value = {
    getProducts,
    products,
    addToCart,
    quantity,
    setQuantity,
    cartItemUpdate,
    categories,
    getCategory,
    getCart,
    cartItemIncrement,
    DeleteFromCart,
    cartProducts,
    cartTotal,
    clearCart,
    wishList,
    addToWish,
    removeFromWish,
    applyCoupon,
    couponCode,
    setCouponCode,
    disCountedTotal,
    setDisCountedTotal,
    error,
    removeCoupon,
    coupon,
    allCoupon,
    address,
    setAddress,
    saveAddress,
    getAddress,
    allAddress,
    profileInfo,
    setProfileInfo,
    getProfile,
    loader,
    setLoader,
    selectedCategory,
    handleCategory,
    handleInputChange,
    selectedPrice,
    handlePrice,
    query,
    result,
    filteredItems,
    page,
    setPage,
    progress,
    setProgress,
    hastNextPage,
    getCoupon,
    allCoupons,
    selectedSort,
    handleSort,
    getOrders,
    orders,
    setOrders,
    cHasNextPage,
    dOpen,
    setDopen,
    statusFilter,
    setStatusFilter,
    handleStatus,
    setSelectedCategory,
    setSelectedPrice,
    setSelectedSort,
    setQuery,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
