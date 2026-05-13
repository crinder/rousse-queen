import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
    const styles = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        warning: "bg-amber-500",
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => {
            clearTimeout(timer);
        };
    }, [duration, onClose]);


    const icons = {
        success: <CheckCircle size={20} />,
        error: <XCircle size={20} />,
        warning: <AlertTriangle size={20} />,
    };

    window.scrollTo(0, 0);

    return (
        <div className="fixed top-5 right-5 z-50 animate-slide-in">
            <div
                className={`flex items-center gap-3 text-white px-4 py-3 rounded-xl shadow-xl ${styles[type]}`}
            >
                {icons[type]}
                <span className="text-sm font-medium">{message}</span>

                <button
                    onClick={onClose}
                    className="ml-2 opacity-70 hover:opacity-100"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}