import type { ChangeEvent } from 'react'

export interface UserInfo {
  name: string
  identityCard: string
  userType: 'profesor' | 'estudiante' | 'coordinador'
  semester: string
  email: string
  phone?: string
}

interface UserGeneralProps {
    userInfo: UserInfo;
    isEditing: boolean;
    onInputChange: (field: keyof UserInfo, value: string) => void;
}

export default function UserGeneral({ userInfo, isEditing, onInputChange }: UserGeneralProps) {

  const getUserTypeColor = (type?: UserInfo['userType']) => {
    return type === 'profesor' ? 'text-blue-600' : 'text-green-600'
  }

  const handleChange = (field: keyof UserInfo) => (e: ChangeEvent<HTMLInputElement>) => {
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
                    value={userInfo.name}
                    onChange={handleChange('name')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Cédula</label>
                <input
                    type="text"
                    value={userInfo.identityCard}
                    onChange={handleChange('identityCard')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Correo Electrónico</label>
                <input
                    type="email"
                    value={userInfo.email}
                    onChange={handleChange('email')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                </div>

                {userInfo.phone && (
                <div>
                    <label className="block text-sm font-medium text-onSurface mb-2">Teléfono</label>
                    <input
                    type="tel"
                    value={userInfo.phone}
                    onChange={handleChange('phone')}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>
                )}
            </div>
            </div>

            <div className="bg-white/70 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-onSurface mb-4">Información Académica</h2>
            
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Tipo de Usuario</label>
                <div className="flex items-center gap-4">
                    <span className={`text-sm ${getUserTypeColor(userInfo.userType)} capitalize font-medium`}>{userInfo.userType}</span>
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium text-onSurface mb-2">Semestre Asignado</label>
                <input
                    type="text"
                    value={userInfo.semester || 'N/A'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
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
