import type { CaseBeneficiaryModel } from "#domain/models/caseBeneficiary.ts";
import type { ReactNode } from "react";
import { Link } from "react-router";

interface BeneficiaryCardProps {
  beneficiary: CaseBeneficiaryModel;
  icon: ReactNode;
  to?: string;
}

export default function BeneficiaryCard({ beneficiary, icon, to }: BeneficiaryCardProps) {
  const title = beneficiary.fullName?.trim().length
    ? beneficiary.fullName
    : "Beneficiario";

  const idPrefix = beneficiary.idNationality ? `${beneficiary.idNationality}-` : "";

  const MainText = (
    <span className="text-body-small">
      <strong className="text-body-medium">{title}</strong> &nbsp; {idPrefix}
      {beneficiary.identityCard}
    </span>
  );

  return (
    <span className="flex items-center gap-3">
      {icon}
      <span className="flex flex-col">
        {to ? (
          <Link to={to} className="text-body-small hover:underline">
            <strong className="text-body-medium">{title}</strong> &nbsp; {idPrefix}
            {beneficiary.identityCard}
          </Link>
        ) : (
          MainText
        )}
        <span className="text-body-small text-onSurface/70">
          <strong className="text-body-small">Tipo:</strong> {beneficiary.caseType}
          {beneficiary.relationship?.trim() ? (
            <>
              {" "}
              · <strong className="text-body-small">Relación:</strong> {beneficiary.relationship}
            </>
          ) : null}
          {beneficiary.description?.trim() ? (
            <>
              {" "}
              · <strong className="text-body-small">Descripción:</strong> {beneficiary.description}
            </>
          ) : null}
        </span>
      </span>
    </span>
  );
}
