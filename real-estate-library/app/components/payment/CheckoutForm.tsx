"use client";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2000 }),
    });
    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Payment failed");
    } else {
      alert("Payment succeeded!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: "4px",
          padding: "48px 40px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p
            style={{
              color: "#555",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Secure Checkout
          </p>
          <h1
            style={{
              color: "#fff",
              fontSize: "26px",
              fontWeight: "400",
              margin: 0,
            }}
          >
            Complete Payment
          </h1>
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#16a34a", fontSize: "22px" }}>$20.00</span>
            <span style={{ color: "#444", fontSize: "13px" }}>CAD</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Card field */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#888",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Card Details
            </label>
            <div
              style={{
                background: "#1e1e1e",
                border: "1px solid #333",
                borderRadius: "4px",
                padding: "14px 16px",
              }}
            >
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#ffffff",
                      fontFamily: "Georgia, serif",
                      "::placeholder": { color: "#555" },
                      iconColor: "#16a34a",
                    },
                    invalid: { color: "#ef4444" },
                  },
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                color: "#ef4444",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!stripe || loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#166534" : "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Processing..." : "Pay $20.00"}
          </button>

          {/* Footer */}
          <p
            style={{
              color: "#444",
              fontSize: "11px",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            🔒 Secured by Stripe
          </p>
        </form>
      </div>
    </div>
  );
}
