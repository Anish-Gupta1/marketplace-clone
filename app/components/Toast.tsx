"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
};

const bgColors: Record<ToastType, string> = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
};

const textColors: Record<ToastType, string> = {
  success: "text-green-700",
  error: "text-red-700",
  info: "text-blue-700",
};

const borderColors: Record<ToastType, string> = {
  success: "border-l-4 border-l-green-500",
  error: "border-l-4 border-l-red-500",
  info: "border-l-4 border-l-blue-500",
};

export default function Toast({
  message,
  type = "info",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm rounded border ${borderColors[type]} ${bgColors[type]} p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      <p className={`text-sm font-medium ${textColors[type]}`}>{message}</p>
    </div>
  );
}
