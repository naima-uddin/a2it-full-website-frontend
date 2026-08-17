import { redirect } from "next/navigation";

// The HRM login now lives at /hrm/administration-login.
// Visiting /hrm forwards there so old links and logout redirects keep working.
export default function HrmIndex() {
  redirect("/hrm/administration-login");
}
