import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";

import TextInput from "#components/TextInput.tsx";
import type { UserModel } from "#domain/models/user.ts";
import Dialog from "./Dialog";
import SearchBar from "#components/SearchBar.tsx";
import UserCard from "#components/UserCard.tsx";

type UserSearchable = Omit<UserModel, "type">;

interface UserSearchDialogProps<TUser extends UserSearchable = UserSearchable> {
  open: boolean;
  users: TUser[];
  onClose: () => void;
  onSelect?: (user: TUser) => void;
  title?: string;
  placeholder?: string;
}

export default function UserSearchDialog<TUser extends UserSearchable = UserSearchable>({
  open,
  users,
  onClose,
  onSelect,
  title = "Buscar usuario",
  placeholder = "Buscar por nombre o cédula...",
}: UserSearchDialogProps<TUser>) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const fuse = useMemo(() => {
    return new Fuse(users, {
      keys: [
        { name: "fullName", weight: 0.7 },
        { name: "identityCard", weight: 0.3 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, [users]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return users;
    return fuse.search(trimmed).map((r) => r.item);
  }, [fuse, query, users]);

  if (!open) return null;

  return (
    <Dialog
      open={open}
      title={title}
      onClose={onClose}
    >
      <SearchBar
        variant="outline"
        isOpen={true}
        defaultValue={query}
        onChange={setQuery}
        placeholder={placeholder}
      />

      <div className="flex flex-col gap-2 max-h-[60vh] overflow-auto">
        {results.length === 0 ? (
          <div className="text-body-medium text-onSurface/70 px-2 py-3">
            No se encontraron usuarios.
          </div>
        ) : (
          results.map((user) => (
            <UserCard
              onClick={() => onSelect && onSelect(user)}
              key={user.identityCard}
              user={user}
            />
          ))
        )}
      </div>
    </Dialog>
  );
}
