import type { FC, ReactNode } from 'react';
import { ButtonText } from './ButtonText';
import { Home, User } from 'flowbite-react-icons/solid';
import { useNavigate } from 'react-router';

export interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  link: string;
  onClick?: () => void;
}

interface LateralMenuProps {
  items: MenuItem[];
  activeItemId?: string;
  className?: string;
  isCollapsed?: boolean;
}

export const LateralMenu: FC<LateralMenuProps> = ({
  items = [
  { id: 'home', label: 'Inicio', icon: <Home />, link: '/' },
  { id: 'users', label: 'Usuarios', icon: <User />, link: '/users' },
],
  activeItemId,
  className = '',
  isCollapsed = false,
}) => {
    const navigate = useNavigate();

  return (
    <aside 
      className={`
        flex flex-col h-full transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-22 px-3' : 'w-75 px-6'} 
        py-6 gap-6
        ${className}
      `}
    >
        <div className={`flex items-center justify-center py-4 transition-all duration-300 ${isCollapsed ? 'scale-75' : ''}`}>
            logo
        </div>

      <nav className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
        {items.map((item) => (
          <ButtonText
            key={item.id}
            title={isCollapsed ? '' : item.label}
            icon={item.icon}
            onClick={() => navigate(item.link)}
            className={`
              w-full transition-all duration-300
              ${isCollapsed ? 'justify-center px-0 aspect-square' : 'justify-start'}
              ${item.id === activeItemId ? 'active' : ''}
            `}
          />
        ))}
      </nav>
    </aside>
  );
};

export default LateralMenu;
