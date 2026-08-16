"use client";

import { useAuth } from "./AuthContext";

export const useUser = () => {
  const { user } = useAuth();
  return { user };
};

export default useUser;
