import { useState } from "react";
import { COUPONS } from "@/utils/coupons";
import { useCartStore } from "@/store/useCartStore";
import { ChevronDown, Check } from "lucide-react";

export default function CouponDropdown() {
  const { applyCoupon, coupon, removeCoupon } = useCartStore();
  const [open, setOpen] = useState(false);

  const selectedCoupon = COUPONS.find((c) => c.code === coupon);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Apply Coupon
      </label>

      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between border rounded-md px-3 py-2 text-sm bg-white hover:border-gray-400 transition"
      >
        <span className="text-left">
          {selectedCoupon
            ? `${selectedCoupon.code} — ${selectedCoupon.discount}% OFF`
            : "Select a coupon"}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="border rounded-md bg-white shadow-md overflow-hidden">
          {COUPONS.map((c) => {
            const isSelected = coupon === c.code;

            return (
              <button
                key={c.code}
                disabled={isSelected}
                onClick={() => {
                  applyCoupon(c.code);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex justify-between items-center hover:bg-gray-100 transition ${
                  isSelected
                    ? "bg-green-50 text-green-700 cursor-not-allowed"
                    : ""
                }`}
              >
                <div>
                  <p className="text-sm font-medium">
                    {c.code}
                  </p>
                  <p className="text-xs text-gray-500">
                    {c.description}
                  </p>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Applied State */}
      {selectedCoupon && (
        <div className="flex justify-between items-center bg-green-50 border border-green-200 p-2 rounded-md">
          <div>
            <p className="text-sm font-medium text-green-700">
              {selectedCoupon.code} applied
            </p>
            <p className="text-xs text-green-600">
              {selectedCoupon.discount}% OFF applied
            </p>
          </div>

          <button
            onClick={removeCoupon}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}