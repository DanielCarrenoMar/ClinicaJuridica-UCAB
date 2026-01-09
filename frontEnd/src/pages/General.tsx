import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { UserCircle, User, Clock } from "flowbite-react-icons/outline"
import { File } from "flowbite-react-icons/solid"
import Tabs from '#components/Tabs.tsx'

interface UserInfo {
  name: string
  identityCard: string
  userType: 'profesor' | 'estudiante'
  semester: string
  email: string
  phone?: string
}

const mockUserInfo: UserInfo = {
  name: 'Pedro Enrrique Calderon Valencia',
  identityCard: 'V-31552270',
  userType: 'profesor',
  semester: '2024-II',
  email: 'pedro.calderon@ucab.edu.ve',
  phone: '+58 414-1234567'
}

function General() {
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState(mockUserInfo)
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setEditedInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getUserTypeColor = (type: UserInfo['userType']) => {
    return type === 'profesor' ? 'text-blue-600' : 'text-green-600'
  }

  return (
    <div className="w-full h-full relative bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
      <div className="container mx-auto px-6 py-8 h-full flex flex-col">
        {/* Header - empty now that icons are removed */}
        <div className="flex justify-end items-center mb-8">
        </div>

        {/* User info header */}
        <div className="w-full p-4 bg-white/70 rounded-2xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserCircle className="w-7 h-7 text-[#10141A]" />
              <div className="flex flex-col">
                <div className="text-[22px] font-normal text-[#10141A]">{editedInfo.name}</div>
                <div className="flex items-center gap-5">
                  <div className="text-[13px] font-medium text-[#10141A]">Cedula</div>
                  <div className="text-[13px] font-normal text-[#10141A]">{editedInfo.identityCard}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs 
          selectedId="general"
          className="mb-6"
        >
          <Tabs.Item 
            id="general" 
            label="General" 
            icon={<User className="w-5 h-5" />}
            onClick={() => navigate(`/usuario/${userId}/general`)}
          />
          <Tabs.Item 
            id="casos-asociados" 
            label="Casos Asociados" 
            icon={<File className="w-5 h-5" />}
            onClick={() => navigate(`/usuario/${userId}/casos-asociados`)}
          />
          <Tabs.Item 
            id="acciones-realizadas" 
            label="Acciones Realizadas" 
            icon={<Clock className="w-5 h-5" />}
            onClick={() => navigate(`/usuario/${userId}/acciones-realizadas`)}
          />
        </Tabs>

        {/* User details */}
        <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Basic Information */}
            <div className="bg-white/70 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-[#10141A] mb-4">Información Básica</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#10141A] mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    value={editedInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10141A] mb-2">Cédula</label>
                  <input
                    type="text"
                    value={editedInfo.identityCard}
                    onChange={(e) => handleInputChange('identityCard', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10141A] mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={editedInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {editedInfo.phone && (
                  <div>
                    <label className="block text-sm font-medium text-[#10141A] mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={editedInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white/70 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-[#10141A] mb-4">Información Académica</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#10141A] mb-2">Tipo de Usuario</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="profesor"
                        checked={editedInfo.userType === 'profesor'}
                        onChange={(e) => handleInputChange('userType', e.target.value)}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      <span className={`text-sm ${getUserTypeColor('profesor')}`}>Profesor</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="estudiante"
                        checked={editedInfo.userType === 'estudiante'}
                        onChange={(e) => handleInputChange('userType', e.target.value)}
                        disabled={!isEditing}
                        className="mr-2"
                      />
                      <span className={`text-sm ${getUserTypeColor('estudiante')}`}>Estudiante</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#10141A] mb-2">Semestre Asignado</label>
                  <select
                    value={editedInfo.semester}
                    onChange={(e) => handleInputChange('semester', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="2024-II">2024-II</option>
                    <option value="2024-I">2024-I</option>
                    <option value="2023-II">2023-II</option>
                    <option value="2023-I">2023-I</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white/70 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-[#10141A] mb-4">Información Adicional</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#10141A]">Estado del Usuario</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Activo
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#10141A]">Fecha de Registro</span>
                  <span className="text-sm text-[#10141A]">15/09/2024</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#10141A]">Última Actualización</span>
                  <span className="text-sm text-[#10141A]">01/11/2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default General
