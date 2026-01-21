import { useState, useEffect } from "react"
import Dialog from '#components/dialogs/Dialog.tsx'
import TextInput from '#components/TextInput.tsx'
import TitleTextInput from '#components/TitleTextInput.tsx'
import DropdownOption from '#components/Dropdown/DropdownOption.tsx'
import TitleDropdown from '#components/TitleDropdown.tsx'
import Button from '#components/Button.tsx'
import LoadingSpinner from '#components/LoadingSpinner.tsx'
import { useCreateStudent } from "#domain/useCaseHooks/useStudent.ts"
import { useCreateTeacher } from "#domain/useCaseHooks/useTeacher.ts"
import { useCreateUser, useFindUser } from "#domain/useCaseHooks/useUser.ts"
import { useNotifications } from "#/context/NotificationsContext.tsx"


interface AddUserDialogProps {
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

// Moved outside to prevent re-render/focus loss
const FormInput = ({ label, ...props }: any) => (
    <div className={`flex flex-col gap-2 items-start`}>
        <div className={`flex items-center px-1.5 w-full`}>
            <p className="text-body-large text-onSurface">
                {label}
            </p>
        </div>
        <TextInput className="w-full" {...props} />
    </div>
)

export default function AddUserDialog({ open, onClose, onSuccess }: AddUserDialogProps) {
    const { createStudent, loading: studentLoading } = useCreateStudent()
    const { createTeacher, loading: teacherLoading } = useCreateTeacher()
    const { createUser, loading: userLoading } = useCreateUser()
    const { findUser, loading: isChecking } = useFindUser()
    const { notyError, notyMessage } = useNotifications()

    const [role, setRole] = useState<'E' | 'P' | 'C' | undefined>(undefined)

    // Common fields
    const [identityCard, setIdentityCard] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [gender, setGender] = useState<'M' | 'F' | undefined>(undefined)

    // Validation state
    const [validationError, setValidationError] = useState<string | null>(null)

    // Student specific
    const [nrc, setNrc] = useState('')
    const [studentType, setStudentType] = useState('REGULAR')

    // Teacher specific
    const [teacherType, setTeacherType] = useState('REGULAR')

    const loading = studentLoading || teacherLoading || userLoading

    const resetForm = () => {
        setRole(undefined)
        setIdentityCard('')
        setFullName('')
        setEmail('')
        setPassword('')
        setGender(undefined)
        setNrc('')
        setStudentType('REGULAR')
        setTeacherType('REGULAR')
        setValidationError(null)
    }

    useEffect(() => {
        if (!open) resetForm()
    }, [open])

    useEffect(() => {
        const checkId = async () => {
            const id = identityCard.trim();
            if (!id) {
                setValidationError(null);
                return;
            }

            // Simple debounce could be here, but sticking to pattern
            setValidationError(null);

            try {
                const exists = await findUser(id);
                if (exists) {
                    setValidationError("Este usuario ya se encuentra registrado");
                }
            } catch (error) {
                // Ignore
            }
        };

        const timeoutId = setTimeout(() => {
            checkId();
        }, 500); // Debounce to avoid spamming while typing

        return () => clearTimeout(timeoutId);
    }, [identityCard, findUser])

    const handleClose = () => {
        // Check if form is dirty
        const isEmpty = !identityCard && !fullName && !email && !password && !role;
        if (isEmpty) {
            onClose();
        } else {
            if (window.confirm("¿Cerrar el diálogo? Se perderán los datos no guardados.")) {
                onClose();
            }
        }
    }

    const handleSubmit = async () => {
        if (validationError) {
            notyError('Corrija los errores antes de continuar.');
            return;
        }

        if (!role || !identityCard || !fullName || !email || !password) {
            notyError('Por favor complete todos los campos obligatorios y seleccione un rol.')
            return
        }

        try {
            let result;
            const commonData = {
                identityCard,
                fullName,
                email,
                password,
                gender: gender || undefined,
                isActive: true
            }

            if (role === 'E') {
                const studentData: any = {
                    ...commonData,
                    type: studentType
                };
                if (nrc.trim() !== '') {
                    studentData.nrc = nrc;
                }

                result = await createStudent(studentData)
            } else if (role === 'P') {
                result = await createTeacher({ ...commonData, type: teacherType as any })
            } else {
                // Coordinator
                result = await createUser({
                    ...commonData,
                    type: 'C',
                    teacherType
                })
            }

            if (result.success) {
                notyMessage(result.message || 'Usuario creado exitosamente')
                onSuccess()
                onClose()
            } else {
                notyError(result.message || 'Error al crear usuario')
            }
        } catch (err: any) {
            notyError(err.message || 'Error desconocido')
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Añadir Usuario"
            closeOnOutsideClick={false}
        >
            <div className="flex flex-col gap-6">

                {/* Row 1: Identity & Name */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <TitleTextInput
                            label="Cédula*"
                            placeholder="12345678"
                            value={identityCard}
                            onChange={setIdentityCard}
                        />
                        {validationError && (
                            <span className="text-error text-label-small mt-1">{validationError}</span>
                        )}
                    </div>
                    <TitleTextInput
                        label="Nombre Completo*"
                        placeholder="Juan Pérez"
                        value={fullName}
                        onChange={setFullName}
                    />
                </div>

                {/* Row 2: Email & Password */}
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Correo Electrónico*"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <FormInput
                        label="Contraseña*"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChangeText={setPassword}
                    />
                </div>

                {/* Row 3: Role & Gender */}
                <div className="grid grid-cols-2 gap-4">
                    <TitleDropdown
                        label="Tipo de Usuario*"
                        selectedValue={role}
                        onSelectionChange={(val) => setRole(val as any)}
                    >
                        <DropdownOption value="E">Estudiante</DropdownOption>
                        <DropdownOption value="P">Profesor</DropdownOption>
                        <DropdownOption value="C">Coordinador</DropdownOption>
                    </TitleDropdown>

                    <TitleDropdown
                        label="Género"
                        selectedValue={gender || undefined}
                        onSelectionChange={(val) => setGender(val as any)}
                    >
                        <DropdownOption value="M">Masculino</DropdownOption>
                        <DropdownOption value="F">Femenino</DropdownOption>
                    </TitleDropdown>
                </div>

                {/* Conditional Rows */}
                {role === 'E' && (
                    <div className="grid grid-cols-2 gap-4">
                        <TitleTextInput
                            label="NRC"
                            placeholder="12345"
                            value={nrc}
                            onChange={setNrc}
                        />
                        <TitleDropdown
                            label="Tipo de Estudiante*"
                            selectedValue={studentType}
                            onSelectionChange={(val) => setStudentType(val as any)}
                        >
                            <DropdownOption value="REGULAR">Regular</DropdownOption>
                            <DropdownOption value="VOLUNTEER">Voluntario</DropdownOption>
                            <DropdownOption value="GRADUATE">Egresado</DropdownOption>
                            <DropdownOption value="SERVICE">Servicio Comunitario</DropdownOption>
                        </TitleDropdown>
                    </div>
                )}

                {role === 'P' && (
                    <div className="grid grid-cols-2 gap-4">
                        <TitleDropdown
                            label="Tipo de Profesor*"
                            selectedValue={teacherType}
                            onSelectionChange={(val) => setTeacherType(val as any)}
                        >
                            <DropdownOption value="REGULAR">Regular</DropdownOption>
                            <DropdownOption value="VOLUNTEER">Voluntario</DropdownOption>
                        </TitleDropdown>
                        {/* Empty cell to maintain grid structure */}
                        <div></div>
                    </div>
                )}
            </div>

            <div className="flex justify-end mt-4 gap-2">

                <Button
                    variant="resalted"
                    onClick={handleSubmit}
                    disabled={loading || !!validationError || isChecking}
                >
                    {loading ? <LoadingSpinner /> : 'Crear Usuario'}
                </Button>
            </div>
        </Dialog>
    )
}
