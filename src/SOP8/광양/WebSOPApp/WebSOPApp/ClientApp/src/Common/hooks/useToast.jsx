import { useContext } from "react";
import { ToastContext } from "../components/Toast/ToastProvider";

const useToast = () => useContext(ToastContext);
export default useToast;