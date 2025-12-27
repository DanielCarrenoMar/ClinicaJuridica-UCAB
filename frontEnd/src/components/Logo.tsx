interface LogoProps {
    variant?: 'logotype' | 'symbol';
}

function Logo({ variant = 'logotype' }: LogoProps) {
    if (variant === 'logotype') 
    return (
        <div className="flex">
            <img src="/ucabLogo.png"/>
            <img src="/clinicaLogo.svg"/>
        </div>
    )
    else return (
        <div className="flex">
            <img src="/ucabLogo.png"/>
        </div>
    )
}
export default Logo;