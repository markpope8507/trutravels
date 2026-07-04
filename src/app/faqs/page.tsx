import { redirect } from "next/navigation";

// FAQs is now part of the Support hub.
export default function FaqsRedirect() {
  redirect("/support");
}
