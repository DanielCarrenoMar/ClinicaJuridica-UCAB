
function Box({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    
    return ( 
        <div className={`p-4 bg-surface/70 rounded-xl ${className}`} {...props}>
            {children}
        </div>
    );
}

export default Box;