import { useState } from "react";
import Button from "../common/Button";

export default function Checkout({ confirm }) {
  const [count, setCount] = useState(1);

  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <div>
      <p>Back</p>
      <h1 className="mb-8 text-4xl font-bold">Order Checkout</h1>
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-xl">
        <div className="space-y-8">
          <div className="flex justify-between">
            <span className="px-6 py-2.5 inline-flex items-center justify-center ">
              <i class="fa-solid fa-cart-shopping"></i>My Cart
            </span>
            <Button onClick={confirm}>Confirm</Button>
          </div>
          <hr />

          <div>
            <div>
              <img src="" alt="" srcset="" />
            </div>
            <div>
              <h3>Honest Burger</h3>
              <p>Hot, Fresh boardwalk-style fries</p>
              <span>Price</span>
            </div>
            <div>
              <span>
                <button onClick={handleDecrease}>-</button>
                {count}
                <button onClick={handleIncrease}>+</button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
