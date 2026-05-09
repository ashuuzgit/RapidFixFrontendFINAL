import CheckoutPage from "./CheckoutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | RapidFix",
  description: "Complete your vehicle service booking.",
};

export default function Page() {
  return <CheckoutPage />;
}
