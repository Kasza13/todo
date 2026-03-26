import { AuthContext, AuthContextType } from "@/providers/auth-provider";
import { useContext } from "react";

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
};
