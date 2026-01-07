import type { ReactNode } from "react";

interface InBoxProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export default function InBox({ children, className, ...props }: InBoxProps){
    return(
        <div className={`px-4 py-2 border border-onSurface/20 bg-surface rounded-xl flex flex-col ${className}`} {...props} >
            {children}
        </div>
    )
}