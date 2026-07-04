import { redirect } from "next/navigation";

// Contact Us is now part of the Support hub.
export default function ContactUsRedirect() {
  redirect("/support");
}
