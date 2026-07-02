import { redirect } from "next/navigation";

// Renamed to /the-tru-way — keep this path working for old links.
export default function WhatsIncludedRedirect() {
  redirect("/the-tru-way");
}
