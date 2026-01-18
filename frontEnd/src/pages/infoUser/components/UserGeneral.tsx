import { roleToPermissionLevel, useAuth } from '#/context/AuthContext';
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';
import TitleDropdown from '#components/TitleDropdown.tsx';
import TitleTextInput from '#components/TitleTextInput.tsx';
import type { StudentModel } from '#domain/models/student.ts';
import type { TeacherModel } from '#domain/models/teacher.ts';
import type { UserModel } from '#domain/models/user.ts';
import type { GenderTypeModel, StudentTypeModel, TeacherTypeModel } from '#domain/typesModel.ts';


interface UserGeneralProps {
    localUser?: UserModel;
    localStudent?: StudentModel;
    localTeacher?: TeacherModel;
    handleUserChange: (updatedFields: Partial<UserModel>) => void;
    handleStudentChange: (updatedFields: Partial<StudentModel>) => void;
    handleTeacherChange: (updatedFields: Partial<TeacherModel>) => void;
    validationErrors: Record<string, string>;
}

export default function UserGeneral({ localUser, localStudent, localTeacher, handleUserChange, handleStudentChange, handleTeacherChange, validationErrors }: UserGeneralProps) {
    
    if (!localUser) {
        return <LoadingSpinner />;
    }

    const { permissionLevel } = useAuth();


    const isInputsDisabled = permissionLevel > roleToPermissionLevel(localUser.type); 

    return (
        <div className="grid grid-cols-3 items-start gap-x-6 gap-y-6">

            <div className="col-span-3 grid grid-cols-2 gap-x-6 gap-y-6">
                <div>
                    <TitleTextInput
                        label="Cédula"
                        value={localUser.identityCard}
                        onChange={(text) => handleUserChange({ identityCard: text })}
                        disabled={isInputsDisabled}
                    />
                    {validationErrors.identityCard && <span className="text-xs text-error mt-1">{validationErrors.identityCard}</span>}
                </div>
                <div>
                    <TitleTextInput
                        label="Nombre y apellido"
                        value={localUser.fullName || ""}
                        onChange={(text) => { handleUserChange({ fullName: text }); }}
                        disabled={isInputsDisabled}
                    />
                    {validationErrors.fullName && <span className="text-xs text-error mt-1">{validationErrors.fullName}</span>}
                </div>
                <div>
                    <TitleTextInput
                        label="Correo"
                        value={localUser.email || ""}
                        onChange={(text) => { handleUserChange({ email: text }); }}
                        disabled={isInputsDisabled}
                    />
                    {validationErrors.email && <span className="text-xs text-error mt-1">{validationErrors.email}</span>}
                </div>
            </div>
            <div className="col-span-1">
                <TitleDropdown
                    label="Sexo"
                    disabled={isInputsDisabled}
                    selectedValue={localUser.gender}
                    onSelectionChange={(value) => {handleUserChange({gender: value as GenderTypeModel})}}
                >
                    <DropdownOption value="Masculino">Masculino</DropdownOption>
                    <DropdownOption value="Femenino">Femenino</DropdownOption>
                </TitleDropdown>
                {validationErrors.gender && <span className="text-xs text-error mt-1">{validationErrors.gender}</span>}
            </div>

            {localStudent && (
                <div className="col-span-1">
                    <TitleDropdown
                        label="Tipo de Estudiante"
                        disabled={isInputsDisabled}
                        selectedValue={localStudent.type}
                        onSelectionChange={(value) => handleStudentChange({ type: value as StudentTypeModel })}
                    >
                        <DropdownOption value="regular">Regular</DropdownOption>
                        <DropdownOption value="volunteer">Voluntario</DropdownOption>
                        <DropdownOption value="graduate">Egresado</DropdownOption>
                        <DropdownOption value="service">Servicio Comunitario</DropdownOption>
                    </TitleDropdown>
                </div>
            )}

            {localTeacher && (
                <div className="col-span-1">
                    <TitleDropdown
                        label="Tipo de Profesor"
                        disabled={isInputsDisabled}
                        selectedValue={localTeacher.type}
                        onSelectionChange={(value) => handleTeacherChange({ type: value as TeacherTypeModel })}
                    >
                        <DropdownOption value="REGULAR">Regular</DropdownOption>
                        <DropdownOption value="VOLUNTEER">Voluntario</DropdownOption>
                    </TitleDropdown>
                </div>
            )}
        </div>
    )
}
