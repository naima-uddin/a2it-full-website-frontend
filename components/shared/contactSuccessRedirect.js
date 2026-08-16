export const THANK_YOU_DELAY_MS = 6000;

const STORAGE_KEY = "thankYouReturnTo";

export const redirectToThankYou = (router) => {
  if (typeof window !== "undefined") {
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    try {
      sessionStorage.setItem(STORAGE_KEY, currentUrl);
    } catch (e) {
      // ignore storage errors
    }
  }

  router.push("/thank-you");
};

export const getReturnToFromStorage = () => {
  if (typeof window === "undefined") return "/";
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return v || "/";
  } catch (e) {
    return "/";
  }
};
