import FreeShippingBar from "@/components/common/FreeShipingBar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useCartStore } from "@/store/useCartStore";
import { Trash2 } from "lucide-react";
import CouponList from "@/components/common/CouponList";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, couponDiscount } =
    useCartStore();
  usePageMeta({
    title: "Cart",
    description: "View and manage your cart items",
  });
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-semibold">Your Cart</h1>

      {cart.length === 0 && (
        <div className="border rounded-xl p-10 text-center text-gray-500">
          <p className="text-lg">Your cart is empty</p>
          <p className="text-sm mt-1">Start adding some products</p>
        </div>
      )}

      <div className="space-y-4">
        {cart.map((item) => {
          const discountAmount =
            (item.price * (item.discountPercentage || 0)) / 100;

          const finalPrice = item.price - discountAmount;

          return (
            <div
              className="flex gap-4 border rounded-xl p-4 items-start"
              key={item.id}>
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1 space-y-2">
                {/* Title + total */}
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.title}
                  </h2>

                  <span className="font-semibold text-sm whitespace-nowrap">
                    ${(finalPrice * item.quantity).toFixed(2)}
                  </span>
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

                {/* Quantity + Remove */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="px-3 py-1 hover:bg-gray-100">
                      -
                    </button>

                    <span className="px-3 text-sm">{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100">
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 rounded-md hover:bg-red-50 text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {cart.length > 0 && <FreeShippingBar total={summary.total} />}
      
      <CouponList />
      {/* Summary */}
      {cart.length > 0 && (
        <div className="border-t pt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${summary.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm text-green-600">
            <span>Product Discount</span>
            <span>-${summary.discount.toFixed(2)}</span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between text-sm text-blue-600">
              <span>Coupon ({couponDiscount}%)</span>
              <span>-${couponAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>

          <p className="text-xs text-green-600">
            You saved ${(summary.discount + couponAmount).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
