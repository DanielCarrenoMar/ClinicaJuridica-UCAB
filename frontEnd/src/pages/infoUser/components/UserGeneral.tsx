import type { UserModel, UserTypeModel } from '#domain/models/user.ts';
import { useGetStudentById } from '#domain/useCaseHooks/useStudent.ts';
import { useGetTeacherById } from '#domain/useCaseHooks/useTeacher.ts';
import { useEffect, type ChangeEvent } from 'react'

interface UserGeneralProps {
    userModel: UserModel;
    onInputChange: (field: keyof UserModel, value: string) => void;
    isEditing: boolean;
}

export default function UserGeneral({ userModel, onInputChange, isEditing }: UserGeneralProps) {
    const { student, loadStudent } = useGetStudentById()
    const { teacher, loadTeacher } = useGetTeacherById()

    useEffect(() => {
        if (userModel.type === 'Estudiante') {
            loadStudent(userModel.identityCard)
        } else if (userModel.type === 'Profesor') {
            loadTeacher(userModel.identityCard)
        }
    }, [userModel, loadStudent, loadTeacher])

    const getUserTypeColor = () => {
        return userModel.type === 'Profesor' ? 'text-blue-600' : 'text-green-600'
    }

  const handleChange = (field: keyof UserModel) => (e: ChangeEvent<HTMLInputElement>) => {
      onInputChange(field, e.target.value);
  }

  return (
     <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-6">
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white/70 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-onSurface mb-4">Información Básica</h2>
            
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Nombre Completo</label>
                <input
                    type="text"
                    value={userModel.fullName}
                    onChange={handleChange('fullName')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Cédula</label>
                <input
                    type="text"
                    value={userModel.identityCard}
                    onChange={handleChange('identityCard')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Correo Electrónico</label>
                <input
                    type="email"
                    value={userModel.email}
                    onChange={handleChange('email')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                </div>
            </div>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-onSurface mb-4">Información Académica</h2>
            
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Tipo de Usuario</label>
                <div className="flex items-center gap-4">
                    <span className={`text-sm ${getUserTypeColor()} capitalize font-medium`}>{userModel.type}</span>
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Semestre Asignado</label>
                faltante (solo mostrar)
                </div>
            </div>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-onSurface mb-4">Información Adicional</h2>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <span className="text-sm text-onSurface">Estado del Usuario</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Activo
                </span>
                </div>
                
                <div className="flex items-center justify-between">
                <span className="text-sm text-onSurface">Fecha de Registro</span>
                <span className="text-sm text-onSurface">--/--/----</span>
                </div>
            </div>
            </div>
        </div>
        </div>
  )
}
