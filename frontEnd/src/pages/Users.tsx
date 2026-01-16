

import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import Fuse from 'fuse.js'
import { UserCircle, Plus } from "flowbite-react-icons/outline"
import { Upload } from "flowbite-react-icons/solid"
import SearchBar from '#components/SearchBar.tsx'
import { useGetAllUsers } from '#domain/useCaseHooks/useUser.ts'
import Box from '#components/Box.tsx'
import Button from '#components/Button.tsx'
import LoadingSpinner from '#components/LoadingSpinner.tsx'

function Users() {
  const { users, loading, error } = useGetAllUsers()
  const [searchValue, setSearchValue] = useState('')

  const filteredUsers = useMemo(() => {
    if (searchValue === '') return users

    const fuse = new Fuse(users, {
      keys: [
        'identityCard',
        'fullName',
        'email',
        'type'
      ]
    })

    return fuse.search(searchValue).map((result) => result.item)
  }, [users, searchValue])

  const handleLoadUsers = () => {
    console.log('Loading users...')
  }

  const handleAddUser = () => {
    console.log('Adding new user...')
  }

  return (
    <div className="flex flex-col h-full">
      <section className="mb-4 flex items-center justify-between gap-6">
        <SearchBar
          isOpen={true}
          placeholder="Buscar usuario..."
          onChange={setSearchValue}
        />
        <div className="flex items-center gap-3">
          <Button
            icon={< Plus />}
            onClick={handleAddUser}
            variant='outlined'
          >
            Añadir
          </Button>
          <Button
            icon={< Upload />}  
            onClick={handleLoadUsers}
            variant='outlined'
          >
            Cargar
          </Button>
        </div>
      </section>
      <section className="flex-1">
        <Box className="col-span-4 h-full flex flex-col gap-2">
          {loading && <div className='flex justify-center'><LoadingSpinner /></div>}
          {error && <div className='text-error'>Error al cargar los usuarios.</div>}
          {!error && filteredUsers.map((user) => (
            <Link
              key={user.identityCard}
              className={`w-full p-4 bg-white/70 border border-onSurface/20 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-surface hover:border-onSurface/40 transition-colors ${!user.isActive ? 'opacity-90' : ''
                }`}
              to={`/usuario/${user.identityCard}`}
            >
              <div className="flex items-center gap-3">
                <UserCircle className="w-7 h-7 " />
                <div className="flex items-center gap-2">
                  <div className="text-[13px] font-medium ">{user.fullName}</div>
                  <div className="text-[13px] font-normal text-black">{user.identityCard}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/*user.assignedCases && (
                    <div className="text-[13px] font-normal /70">
                      {user.assignedCases} Casos Asignados
                    </div>
                  )*/}
                  <p className='text-body-small text-onSurface/70'>{user.type}</p>
                <div
                  className={`px-4 py-2 rounded-2xl flex items-center justify-center ${user.isActive
                    ? 'bg-success text-surface'
                    : 'bg-onSurface text-surface'
                    }`}
                >
                  <div className="text-[13px] font-normal">
                    {user.isActive ? 'Activo' : 'Deshabilitado'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </Box>
      </section>
    </div>
  )
}

export default Users
