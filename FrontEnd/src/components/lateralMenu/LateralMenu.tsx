import Button from '#components/Button.tsx';
import Logo from '#components/Logo.tsx';
import { AngleLeft, AngleRight } from 'flowbite-react-icons/outline';
import { Children, cloneElement, isValidElement, type FC, type ReactElement, type ReactNode, Fragment } from 'react';

interface LateralMenuProps {
  children: ReactNode;
  activeItemId?: string;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export interface MenuItem {
    isCollapsed?: boolean;
}

export const LateralMenu: FC<LateralMenuProps> = ({
  children,
  activeItemId,
  className = '',
  isCollapsed = false,
  onToggleCollapse,
}) => {
  
  const renderChildren = (children: ReactNode): ReactNode => {
    return Children.map(children, (child) => {
      if (!isValidElement(child)) return child;

      if (child.type === Fragment) {
        return <Fragment>{renderChildren((child as ReactElement<any>).props.children)}</Fragment>;
      }

      return cloneElement(child as ReactElement<any>, { isCollapsed, activeItemId });
    });
  };

  return (
    <aside 
      className={`
        flex flex-col h-full transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      <header className={`flex items-center justify-start pb-4 transition-all duration-300`}>
          <Logo variant={isCollapsed ? 'symbol' : 'logotype'} />
      </header>
      <div className='flex gap-2'>
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {renderChildren(children)}
        </nav>
        <div>
          <Button icon={!isCollapsed ? <AngleLeft /> : <AngleRight />} onClick={onToggleCollapse}/>
        </div>
      </div>
    </aside>
  );
};

export default LateralMenu;
