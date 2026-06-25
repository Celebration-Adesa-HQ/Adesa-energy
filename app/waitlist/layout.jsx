import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Join the Waitlist - Adesa Energy CNG",
  description:
    "Join the Adesa Energy waitlist to book your vehicle CNG conversion, refueling, or express interest in bank-backed financing in Nigeria.",
  path: "/waitlist",
});

export default function ContactLayout({ children }) {
  return (
    <main role="main">
      <h1 className="sr-only">Contact Adesa Energy</h1>
      <section>{children}</section>
    </main>
  );
}
