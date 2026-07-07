import Button from "../common/Button";

export default function Checkout({
  confirm,
  cartItems,
  onIncrease,
  onDecrease,
}) {
  console.log("Checkout:", cartItems);
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Back */}
      <button className="mb-6 flex items-center gap-2 text-gray-600 hover:text-black">
        ← Back
      </button>

      {/* Heading */}
      <h1 className="mb-8 text-4xl font-bold">Order Checkout</h1>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Section */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-6">
            <div className="flex items-center gap-3 font-semibold">
              <i className="fa-solid fa-cart-shopping"></i>
              My Cart
            </div>

            <Button onClick={confirm}>Confirm</Button>
          </div>
          {/* Product 1 */}
          {cartItems.map((item) => {
            console.log(item);

            return (
              <div
                key={item.id}
                className="flex items-center justify-between border-b p-6"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={item.image}
                    alt="Burger"
                    className="h-24 w-32 rounded-lg object-cover"
                  />

                  <div className="max-w-md">
                    <h3 className="text-lg font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.description}
                    </p>

                    <p className="mt-3 text-sm font-semibold">
                      Extra: Bacon, Cheddar Cheese
                    </p>

                    <p className="text-sm text-gray-500">Without cutlery</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Quantity */}
                  <div className="flex items-center gap-4 rounded-full border px-4 py-2">
                    <button
                      onClick={() => onDecrease(item.id)}
                      className="text-xl font-bold"
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>
                    
                    <button
                      onClick={() => onIncrease(item.id)}
                      className="text-xl font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <h4 className="font-bold whitespace-nowrap">{item.price}</h4>
                </div>
              </div>
            );
          })}
          {/* Bottom */}
          <div className="flex items-end justify-between p-6">
            <button className="rounded-lg border border-yellow-400 px-6 py-3 font-semibold text-yellow-500">
              + Add Discount
            </button>

            <div className="w-72 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>£43.00</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Fee</span>

                <span>£2.00</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>

                <span>-£10.00</span>
              </div>

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>

                <span>£35.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="h-fit rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold">Total Payment</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>£144.00</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>

              <span>£0.00</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>

              <span>-£25.00</span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>£119.00</span>
            </div>

            <button className="mt-6 w-full rounded-lg bg-gray-300 py-3 font-semibold">
              Send Order
            </button>

            <p className="pt-5 text-sm text-gray-500">
              In the case of a group order, the delivery cost is paid
              individually and the balance is refunded based on the total
              amount.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
