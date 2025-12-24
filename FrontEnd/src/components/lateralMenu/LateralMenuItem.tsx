import Button from "#components/Button.tsx";
import ButtonText from "#components/ButtonText.tsx";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";

interface LateralMenuItemProps {
    id: string;
    label: string;
    icon: ReactNode;
    link: string;
    onClick?: () => void;
    isCollapsed?: boolean;
    activeItemId?: string;
}

function LateralMenuItem ({id, label, icon, link, onClick, isCollapsed, activeItemId}:LateralMenuItemProps){
    const navigate = useNavigate();

    return (
        <Button
            id={id}
            icon={icon}
            onClick={() => {navigate(link); if (onClick) onClick()}}
            variant={id === activeItemId ? 'active' : 'filled'}
        >
            {!isCollapsed && label}
        </Button>
    )
}
export default LateralMenuItem;