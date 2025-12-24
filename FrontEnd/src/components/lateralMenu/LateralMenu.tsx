import Button from '#components/Button.tsx';
import Logo from '#components/Logo.tsx';
import { AngleLeft, AngleRight } from 'flowbite-react-icons/outline';
import { Children, cloneElement, isValidElement, type FC, type ReactElement, type ReactNode } from 'react';

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
  

  return (
    <aside 
      className={`
        flex h-full transition-all duration-300 ease-in-out gap-6
        ${className}
      `}
    >
      <div className='flex flex-col'>
        <div className={`flex items-center justify-center py-4 transition-all duration-300`}>
          <Logo variant={isCollapsed ? 'symbol' : 'logotype'} />
        </div>

        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar">
          {Children.map(children, (child) => {
              if (isValidElement(child)) {
                  return cloneElement(child as ReactElement<any>, { isCollapsed, activeItemId });
              }
              return child;
          })}
        </nav>
      </div>
      <div>
        <Button icon={!isCollapsed ? <AngleLeft /> : <AngleRight />} onClick={onToggleCollapse}/>
      </div>
    
    </aside>
  );
};

export default LateralMenu;
