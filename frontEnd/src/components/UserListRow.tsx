import { Link } from 'react-router';
import { UserCircle } from "flowbite-react-icons/outline";
import type { UserModel } from '#domain/models/user.ts';

type Props = {
    user: UserModel;
}

export default function UserListRow({ user }: Props) {
    return (
        <Link
            className={`w-full py-2.5 px-4 max-w-5xl bg-white/70 border border-onSurface/20 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-surface hover:border-onSurface/40 transition-colors ${!user.isActive ? 'opacity-90' : ''}`}
            to={`/usuario/${user.identityCard}`}
        >
            <div className="flex items-center gap-3">
                <UserCircle />
                <div className="flex items-center gap-2">
                    <div className="text-body-medium">{user.fullName}</div>
                    <div className="text-body-small">{user.identityCard}</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <p className='text-body-small text-onSurface/70'>{user.type}</p>
                <div
                    className={`px-4 py-2 rounded-2xl flex items-center justify-center ${user.isActive
                        ? 'bg-success text-surface'
                        : 'bg-onSurface text-surface'
                        }`}
                >
                    <div className="text-body-medium font-normal">
                        {user.isActive ? 'Activo' : 'Inactivo'}
                    </div>
                </div>
            </div>
        </Link>
    )
}
