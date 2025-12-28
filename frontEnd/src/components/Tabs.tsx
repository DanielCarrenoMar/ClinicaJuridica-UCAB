import { Children, cloneElement, isValidElement, useMemo, useState, type JSX, type ReactElement, type ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  selectedId?: string;
  defaultSelectedId?: string;
  onChange?: (id: string) => void;
  className?: string;
  gapClassName?: string;
}

interface TabItemProps {
  id: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface InternalTabProps extends TabItemProps {
  isActive?: boolean;
  onSelect?: () => void;
}

function TabItem({ id, label, icon, className = '', isActive, onSelect, onClick }: InternalTabProps) {
  const baseStyles = 'flex flex-1 items-center justify-center gap-1.5 px-9 py-1.5 border-b cursor-pointer transition-opacity';
  const activeStyles = 'border-b-2 border-success opacity-100';
  const inactiveStyles = 'border-onSurface/20 opacity-40 hover:opacity-70';

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles} ${className}`}
      onClick={() => {
        if (onSelect) onSelect();
        if (onClick) onClick();
      }}
      id={id}
    >
      {icon && <span className="size-5">{icon}</span>}
      <span className="text-body-medium">{label}</span>
    </button>
  );
}

type TabsComponent = ((props: TabsProps) => JSX.Element) & { Item: typeof TabItem };

const Tabs: TabsComponent = ({
  children,
  selectedId,
  defaultSelectedId,
  onChange,
  className = '',
}: TabsProps) => {
  const validChildren = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<TabItemProps>[] ,
    [children]
  );

  const firstChildId = validChildren[0]?.props.id;
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(defaultSelectedId ?? firstChildId);
  const currentSelectedId = selectedId ?? internalSelectedId;

  const selectTab = (id: string) => {
    if (selectedId === undefined) {
      setInternalSelectedId(id);
    }
    if (onChange) onChange(id);
  };

  return (
    <div className={`flex w-full ${className}`} role="tablist">
      {validChildren.map((child) => {
        const isActive = child.props.id === currentSelectedId;
        return cloneElement(child, {
          key: child.props.id,
          isActive,
          onSelect: () => selectTab(child.props.id),
        });
      })}
    </div>
  );
};

Tabs.Item = TabItem;

export default Tabs;
export { TabItem };