import NotificationToast from "./NotificationToast";

export type NotificationVariant = "message" | "error";

export type NotificationItem = {
  id: string;
  text: string;
  variant: NotificationVariant;
};


type Props = {
  items: NotificationItem[];
  onClose: (id: string) => void;
};

export default function NotificationContainer({ items, onClose }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {items.map((item) => (
        <NotificationToast key={item.id} item={item} onClose={onClose} />
      ))}
    </div>
  );
}
