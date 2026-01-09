

import { useState } from 'react'
import { UserCircle, Plus } from "flowbite-react-icons/outline"
import { Upload } from "flowbite-react-icons/solid"
import SearchBar from '#components/SearchBar.tsx'

interface User {
  id: string
  name: string
  identityCard: string
  assignedCases?: number
  status: 'active' | 'disabled'
}

const mockUsers: User[] = [
  { id: '1', name: 'Pedro Calderon', identityCard: 'V-31552232', assignedCases: 3, status: 'active' },
  { id: '2', name: 'Pedro Calderon', identityCard: 'V-31552232', assignedCases: 3, status: 'active' },
  { id: '3', name: 'Pedro Calderon', identityCard: 'V-31552232', status: 'disabled' },
  { id: '4', name: 'Pedro Calderon', identityCard: 'V-31552232', status: 'disabled' },
  { id: '5', name: 'Pedro Calderon', identityCard: 'V-31552232', status: 'disabled' },
  { id: '6', name: 'Pedro Calderon', identityCard: 'V-31552232', status: 'disabled' },
]

function Users() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const handleLoadUsers = () => {
    console.log('Loading users...')
  }

  const handleAddUser = () => {
    console.log('Adding new user...')
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
      <div className="container mx-auto px-6 py-8 h-full flex flex-col">
        {/* Header - empty now that icons are removed */}
        <div className="flex justify-end items-center mb-8">
        </div>

        {/* Search bar and action buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1 max-w-md">
            <SearchBar
              isOpen={searchOpen}
              onToggle={setSearchOpen}
              defaultValue={searchValue}
              onChange={setSearchValue}
              placeholder="Placeholder text"
              variant="outline"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddUser}
              className="px-4 py-2.5 bg-white border border-[#202020] rounded-full flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-normal text-[#202020]">Añadir</span>
            </button>
            <button
              onClick={handleLoadUsers}
              className="px-4 py-2.5 bg-white border border-[#202020] rounded-full flex items-center gap-2.5 hover:bg-gray-50 transition-colors"
            >
              <Upload className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-normal text-[#202020]">Cargar</span>
            </button>
          </div>
        </div>

        {/* User cards list */}
        <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
          <div className="flex flex-col gap-2">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className={`w-full p-4 bg-white/70 rounded-2xl flex items-center justify-between ${
                  user.status === 'disabled' ? 'opacity-90' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCircle className="w-7 h-7 text-[#10141A]" />
                  <div className="flex items-center gap-2">
                    <div className="text-[13px] font-medium text-[#10141A]">{user.name}</div>
                    <div className="text-[13px] font-normal text-black">{user.identityCard}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {user.assignedCases && (
                    <div className="text-[13px] font-normal text-[#10141A]/70">
                      {user.assignedCases} Casos Asignados
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl flex items-center justify-center ${
                      user.status === 'active'
                        ? 'bg-[#4990E2] text-[#F6F5F8]'
                        : 'bg-[#202020] text-[#F6F5F8]'
                    }`}
                  >
                    <div className="text-[13px] font-normal">
                      {user.status === 'active' ? 'Activo' : 'Deshabilitado'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users
