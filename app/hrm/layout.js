import HrmAuthProvider from "@/components/hrm/AuthProvider";
import AppToaster from "@/components/hrm/AppToaster";

export const metadata = {
  title: "A2IT HRM System",
  description: "Employee Management & Payroll System",
};

export default function HrmLayout({ children }) {
  return (
    <>
      <HrmAuthProvider>{children}</HrmAuthProvider>
      <AppToaster />
    </>
  );
}
