import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { amount } = await req.json();

  const intent = await stripe.paymentIntents.create({
    amount,
    currency: "cad",
  });

  return NextResponse.json({ clientSecret: intent.client_secret });
}
