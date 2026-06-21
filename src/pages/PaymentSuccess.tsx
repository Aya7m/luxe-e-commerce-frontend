import { useEffect, useState } from "react";
import { CheckCircle, MessageCircle, Package } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmStripePaymentApi } from "../services/order.service";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await confirmStripePaymentApi({
          sessionId,
        });

        setOrder(res);

        // 🧹 مهم جدًا: تفريغ السلة
        localStorage.removeItem("cart");

        toast.success("Order confirmed successfully");
      } catch (err) {
        toast.error("Payment confirmation failed");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-gray-500">Confirming payment...</p>
      </div>
    );
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl">

        <CheckCircle size={90} className="mx-auto mb-6 text-green-500" />

        <h1 className="mb-3 text-4xl font-bold">
          Payment Successful 🎉
        </h1>

        <p className="mb-8 text-lg text-gray-500">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {order && (
          <div className="mb-8 rounded-2xl bg-green-50 p-5">
            <p className="font-medium text-green-700">
              Order ID: {order._id}
            </p>

            <p className="mt-2 text-sm text-green-600">
              Total: ${order.totalPrice}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row">

          <Link
            to="/orders"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-white"
          >
            <Package size={20} />
            View My Orders
          </Link>

          <Link
            to="/chat"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border px-6 py-4"
          >
            <MessageCircle size={20} />
            Chat With Admin
          </Link>
        </div>

        <div className="mt-8 border-t pt-6 text-sm text-gray-400">
          Need help? Contact support anytime.
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;