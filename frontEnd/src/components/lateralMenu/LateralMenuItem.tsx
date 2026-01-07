import type { ReactNode } from "react";
import type { MenuItem } from "./LateralMenu";
import LinkButton from "#components/LinkButton.tsx";

interface LateralMenuItemProps extends MenuItem {
    id: string;
    label: string;
    icon: ReactNode;
    link: string;
    onClick?: () => void;
    activeItemId?: string;
}

function LateralMenuItem ({id, label, icon, link, onClick, isCollapsed, activeItemId}:LateralMenuItemProps){

    return (
        <LinkButton
            id={id}
            icon={icon}
            to={link}
            onClick={onClick}
            variant={id === activeItemId ? 'active' : 'filled'}
        >
            {!isCollapsed && label}
        </LinkButton>
    )
}
export default LateralMenuItem;