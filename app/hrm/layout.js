import HrmAuthProvider from "@/components/hrm/AuthProvider";
import AppToaster from "@/components/hrm/AppToaster";

export const metadata = {
  title: "A2IT HRM System",
  description: "Employee Management & Payroll System",
  // HRM is a private, login-protected module — keep it out of search engines.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function HrmLayout({ children }) {
  return (
    <>
      <HrmAuthProvider>{children}</HrmAuthProvider>
      <AppToaster />
    </>
  );
}
