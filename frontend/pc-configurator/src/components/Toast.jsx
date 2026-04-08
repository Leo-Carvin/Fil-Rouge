import React, { useEffect, useState } from "react";

export default function Toast({ message, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-primary-dark px-5 py-3 ring-1 ring-primary-light/20 transition-all duration-300 ${visible ? "opacity-100 translate-y-0 animate-toast-in" : "opacity-0 translate-y-4"}`}>
      <span className="text-lg">✅</span>
      <p className="text-sm font-semibold text-white">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 text-primary-light hover:text-white text-xs transition">✕</button>
    </div>
  );
}