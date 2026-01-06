import { Close } from "flowbite-react-icons/outline";
import type { NotificationItem } from "./NotificationContainer";

type Props = {
  item: NotificationItem;
  onClose: (id: string) => void;
};

export default function NotificationToast({ item, onClose }: Props) {
  const isError = item.variant === "error";

  return (
    <div
      className={
        "pointer-events-auto w-88 max-w-[calc(100vw-2rem)] rounded-xl border px-4 py-3 shadow-2xl ring-1 ring-onSurface/10 " +
        (isError
          ? "bg-error text-surface border-error"
          : "bg-surface text-onSurface border-onSurface/10")
      }
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <div className="flex items-start gap-3">
        <p className={"flex-1 text-body-medium " + (isError ? "text-surface" : "text-onSurface")}>{item.text}</p>
        <button
          type="button"
          onClick={() => onClose(item.id)}
          className={
            "rounded-lg p-1 transition-colors " +
            (isError ? "hover:bg-surface/10" : "hover:bg-onSurface/5")
          }
          aria-label="Cerrar notificación"
        >
          <Close className={isError ? "text-surface" : "text-onSurface"} />
        </button>
      </div>
    </div>
  );
}
