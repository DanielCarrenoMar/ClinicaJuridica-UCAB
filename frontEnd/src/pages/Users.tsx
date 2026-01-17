

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { Plus } from "flowbite-react-icons/outline"
import { Upload } from "flowbite-react-icons/solid"
import SearchBar from '#components/SearchBar.tsx'
import { useGetAllUsers } from '#domain/useCaseHooks/useUser.ts'
import Box from '#components/Box.tsx'
import Button from '#components/Button.tsx'
import LoadingSpinner from '#components/LoadingSpinner.tsx'
import UserListRow from '#components/UserListRow.tsx'

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
            <UserListRow key={user.identityCard} user={user} />
          ))}
        </Box>
      </section>
    </div>
  )
}

export default Users
