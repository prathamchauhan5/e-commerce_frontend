export default function FreeShippingBar({ total }) {
  const THRESHOLD = 50;

  const remaining = THRESHOLD - total;
  const progress = Math.min((total / THRESHOLD) * 100, 100);

  const isUnlocked = total >= THRESHOLD;

  return (
    <div className="p-3 rounded-lg bg-gray-50 space-y-2">
      <p className="text-sm">
        {isUnlocked ? (
          <span className="text-green-600 font-medium">
            🎉 You unlocked free shipping!
          </span>
        ) : (
          <>
            Add{" "}
            <span className="font-medium">
              ${remaining.toFixed(2)}
            </span>{" "}
            more to get free shipping
          </>
        )}
      </p>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}