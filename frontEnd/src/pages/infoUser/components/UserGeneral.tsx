import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import TitleDropdown from '#components/TitleDropdown.tsx';
import TitleTextInput from '#components/TitleTextInput.tsx';
import type { StudentModel } from '#domain/models/student.ts';
import type { TeacherModel } from '#domain/models/teacher.ts';
import type { UserModel } from '#domain/models/user.ts';
import type { GenderTypeModel } from '#domain/typesModel.ts';
import { useState } from 'react';

interface UserGeneralProps {
    localUser?: UserModel;
    localStudent?: StudentModel;
    localTeacher?: TeacherModel;
    handleUserChange: (updatedFields: Partial<UserModel>) => void;
    handleStudentChange: (updatedFields: Partial<StudentModel>) => void;
    handleTeacherChange: (updatedFields: Partial<TeacherModel>) => void;
}

export default function UserGeneral({ localUser, localStudent, localTeacher, handleUserChange, handleStudentChange, handleTeacherChange }: UserGeneralProps) {
    
    if (!localUser) {
        return <LoadingSpinner />;
    }

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const getUserTypeColor = () => {
        return localUser.type === 'Profesor' ? 'text-blue-600' : 'text-green-600'
    }

    return (
        <div className="grid grid-cols-3 items-start gap-x-6 gap-y-6">

            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <TitleTextInput
                        label="Cédula"
                        value={localUser.identityCard}
                        onChange={(text) => handleUserChange({ identityCard: text })}
                    />
                    {validationErrors.identityCard && <span className="text-xs text-error mt-1">{validationErrors.identityCard}</span>}
                </div>
                <div>
                    <TitleTextInput
                        label="Nombre y apellido"
                        value={localUser.fullName || ""}
                        onChange={(text) => { handleUserChange({ fullName: text }); }}
                    />
                    {validationErrors.fullName && <span className="text-xs text-error mt-1">{validationErrors.fullName}</span>}
                </div>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Sexo"
                    selectedValue={localUser.gender || undefined}
                    onSelectionChange={(value) => { handleUserChange({ gender: value as GenderTypeModel }); }}
                >
                    <DropdownOption value="Masculino">Masculino</DropdownOption>
                    <DropdownOption value="Femenino">Femenino</DropdownOption>
                </TitleDropdown>
                {validationErrors.gender && <span className="text-xs text-error mt-1">{validationErrors.gender}</span>}
            </div>
        </div>
    )
}
