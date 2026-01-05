import Button from "#components/Button.tsx";
import { Close } from "flowbite-react-icons/outline";

interface DialogProps {
    open: boolean;
    title: string;
    headerItems?: React.ReactNode;
    children: React.ReactNode;
    onClose: () => void;
}

export default function Dialog({
    open,
    title,
    headerItems,
    children,
    onClose
}: DialogProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm px-4" onClick={onClose}>
            <div id={title}
                className="w-full max-w-lg rounded-xl bg-surface shadow-xl border border-onSurface/10 p-6 flex flex-col gap-6" 
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between">
                    <h4 className="text-label-small">{title}</h4>
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