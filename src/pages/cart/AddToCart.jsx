import AxiosSessionInstance from "../../api/AxiosSessionInstance.jsx";

export const AddToCart = async (product) => {
  const payload = {
    productId: product._id || product.id,
    quantity: 1,
  };

  const { data } = await AxiosSessionInstance.post("/cart", payload);
  return data;
};
