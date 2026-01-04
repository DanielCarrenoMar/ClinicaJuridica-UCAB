import type { ReactNode } from "react";

interface InBoxProps {
    children?: ReactNode;
}

export default function InBox({ children }: InBoxProps){
    return(
        <div className="px-4 py-2 border border-onSurface/20 bg-surface rounded-xl flex flex-col gap-4">
            {children}
        </div>
    )
}