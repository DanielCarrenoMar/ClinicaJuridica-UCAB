import type { PersonModel } from "#domain/models/person.ts"
import type { ReactNode } from "react";
import { Link } from "react-router";

interface PersonCardProps {
    person: PersonModel;
    icon: ReactNode;
    to?: string;
}

export default function PersonCard({ person, icon, to }: PersonCardProps) {
    return <span className="flex items-center gap-3">
        {icon}
        {
            to ? <Link to={to} className="text-body-small hover:underline"><strong className="text-body-medium">{person.fullName}</strong> {person.idNationality && `${person.idNationality}-`}{person.identityCard}</Link>
                : <span className="text-body-small"><strong className="text-body-medium">{person.fullName}</strong> {person.idNationality && `${person.idNationality}-`}{person.identityCard}</span>
        }
    </span>
}