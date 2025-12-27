import type { MenuItem } from "./LateralMenu";

interface LateralMenuTitleProps extends MenuItem {
    label: string;
}

function LateralMenuTitle({label, isCollapsed}: LateralMenuTitleProps) {
    return (
        <span className="text-body-small px-5">{!isCollapsed ? label : label[0]}</span>
    )
}
export default LateralMenuTitle;