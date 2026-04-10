import { useCartStore } from "@/store/useCartStore";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import FreeShippingBar from "./FreeShipingBar";

export default function CartSlider() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    loadingItems,
    couponDiscount,
  } = useCartStore();

  const summary = cart.reduce(
    (acc, item) => {
      const discountAmount =
        (item.price * (item.discountPercentage || 0)) / 100;

      const discountedPrice = item.price - discountAmount;

      acc.subtotal += item.price * item.quantity;
      acc.discount += discountAmount * item.quantity;
      acc.total += discountedPrice * item.quantity;

      return acc;
    },
    { subtotal: 0, discount: 0, total: 0 },
  );
  const couponAmount = (summary.total * (couponDiscount || 0)) / 100;

  const finalTotal = summary.total - couponAmount;

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "auto";
  }, [isCartOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="font-semibold text-lg">Your Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-md hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-64px)]">
          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 && (
              <p className="text-gray-500 text-center mt-10">
                Your cart is empty
              </p>
            )}

            {cart.map((item) => {
              const isLoading = loadingItems[item.id];

              const discountAmount =
                (item.price * (item.discountPercentage || 0)) / 100;

              const finalPrice = item.price - discountAmount;

              return (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.thumbnail}
                    className="w-16 h-16 object-cover rounded"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm line-clamp-2">{item.title}</p>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                        className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">
                        ${finalPrice.toFixed(2)}
                      </p>

                      {item.discountPercentage > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="line-through text-gray-400">
                            ${item.price}
                          </span>

                          <span className="text-green-600">
                            -${discountAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        disabled={isLoading}
                        className="px-2 border rounded">
                        -
                      </button>

                      <span className="text-sm">{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={isLoading}
                        className="px-2 border rounded">
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="text-sm font-medium">
                    ${(finalPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
          {cart.length > 0 && <FreeShippingBar total={summary.total} />}
          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 pb-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${summary.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${summary.discount.toFixed(2)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Coupon ({couponDiscount}%)</span>
                    <span>-${couponAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <p className="text-xs text-green-600">
                  You saved ${(summary.discount + couponAmount).toFixed(2)}
                </p>
              </div>

              <Link
                to="/cart"
                onClick={closeCart}
                className="block text-center bg-black text-white py-2 rounded-md">
                View Cart
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
