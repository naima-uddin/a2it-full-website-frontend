"use client";

// Global toast host for the whole app. Uses react-hot-toast's ToastBar render
// prop to add a manual close (✕) button to every toast — success, error and
// custom — so any toast can be dismissed by hand. Rendered once in the root
// layout; individual pages should NOT render their own <Toaster>.
import { Toaster, ToastBar, toast } from "react-hot-toast";
import { X } from "lucide-react";

export default function AppToaster() {
  return (
    <Toaster position="top-right" toastOptions={{ duration: 4000 }}>
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-center gap-1.5">
              {icon}
              <div className="flex-1">{message}</div>
              {/* Loading toasts resolve on their own — no close button */}
              {t.type !== "loading" && (
                <button
                  type="button"
                  onClick={() => toast.dismiss(t.id)}
                  aria-label="Close notification"
                  className="ml-1 shrink-0 rounded-full p-1 text-gray-200 hover:text-white hover:bg-black/5 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
