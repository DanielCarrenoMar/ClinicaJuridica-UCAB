function Box(props: React.HTMLAttributes<HTMLDivElement>) {
    
    return ( 
        <div className={`p-4 ${props.className}`} {...props}>
            {props.children}
        </div>
    );
}

export default Box;