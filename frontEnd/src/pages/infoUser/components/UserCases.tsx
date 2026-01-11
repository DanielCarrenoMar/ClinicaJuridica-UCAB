import CaseCard from '#components/CaseCard.tsx'
import type { UserTypeModel } from '#domain/models/user.ts';
import { useGetCasesByStudentId } from '#domain/useCaseHooks/useStudent.ts';
import { useGetCasesByTeacherId } from '#domain/useCaseHooks/useTeacher.ts';
import { useEffect } from 'react';

interface UserCasesProps {
    userId: string;
    userType: UserTypeModel
}

export default function UserCases({ userId, userType }: UserCasesProps) {
    const { cases: studentCases, loadCases: loadStudentCases } = useGetCasesByStudentId()
    const { cases: teacherCases, loadCases: loadTeacherCases } = useGetCasesByTeacherId()

    useEffect(() => {
        if (userType === 'Estudiante') {
            loadStudentCases(userId)
        } else if (userType === 'Profesor') {
            loadTeacherCases(userId)
        }
    }, [userId, userType, loadStudentCases, loadTeacherCases])

    const cases = userType === 'Estudiante' ? studentCases : teacherCases

    return (
        <div className="flex-1 overflow-y-auto bg-white/40 rounded-xl p-4">
          <div className="grid grid-cols-1 gap-4">
            {cases.length > 0 ? cases.map((caseItem) => (
              <CaseCard
                key={caseItem.idCase}
                caseData={caseItem}
              />
            )) : <div className="text-center p-4 text-gray-500">No hay casos asociados</div>}
          </div>
        </div>
    )
}
