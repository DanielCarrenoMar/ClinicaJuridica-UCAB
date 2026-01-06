
import { UserCircle } from "flowbite-react-icons/solid";
import { Close } from "flowbite-react-icons/outline";
import Button from "#components/Button.tsx";
import type { UserModel } from "#domain/models/user.ts";

export type UserCardModel = Pick<UserModel, "identityCard" | "fullName">;

type Props = {
	user: UserCardModel;
    onClick?: () => void;
	onClickRemove?: () => void;
};

export default function UserCard({ user, onClick, onClickRemove }: Props) {
	return (
		<button onClick={onClick} className={`flex items-center rounded-xl justify-between gap-3 ${onClick ? 'hover:border-onSurface/40 group rounded-3xl border border-onSurface/20 cursor-pointer' : ''} w-full rounded-lg px-4 py-3 transition-colors`}>
			<div className="flex items-center gap-3 min-w-0">
				<UserCircle className="group-hover:animate-pulsing group-hover:animate-duration-400"/>
				<div className="flex items-end gap-2">
					<p className="text-body-medium truncate">{user.fullName}</p>
					<p className="text-body-small text-onSurface/70 truncate">{user.identityCard}</p>
				</div>
			</div>

			{onClickRemove && (
				<Button
					onClick={onClickRemove}
					icon={<Close />}
					className="p-2!"
					variant="outlined"
					type="button"
				/>
			)}
		</button>
	);
}
