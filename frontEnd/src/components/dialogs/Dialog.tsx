import Button from "#components/Button.tsx";
import { Close } from "flowbite-react-icons/outline";
import type { ReactNode } from "react";

interface DialogProps {
    open: boolean;
    title: ReactNode;
    headerItems?: ReactNode;
    children: ReactNode;
    onClose: () => void;
    className?: string;
    id?: string;
}

export default function Dialog({
    open,
    title,
    headerItems,
    children,
    onClose,
    className = "",
    id
}: DialogProps) {
    if (!open) return null;

    const dialogId = id ?? (typeof title === "string" ? title : undefined);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" onClick={onClose}>
            <div id={dialogId}
                className={`w-full max-w-lg rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-6 ${className}`}
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between">
                    <h4 className="text-label-medium">{title}</h4>
                    <span className="flex items-center gap-2">
                        {headerItems}
                        <Button icon={<Close />} variant="outlined" onClick={onClose}></Button>
                    </span>
                </header>
                {children}
            </div>
        </div>
    );
}