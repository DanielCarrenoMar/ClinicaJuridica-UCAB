import Box from "#components/Box.tsx";
import Button from "#components/Button.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import AccionCard from "#components/ActionCard.tsx";
import CasesDonutChart from "#components/CasesDonutChart.tsx";
import { Search } from "flowbite-react-icons/outline";
import type { CaseActionModel } from "#domain/models/caseAction.ts";
import TextInput from "#components/TextInput.tsx";
import { useNavigate } from "react-router";

const mockActions: CaseActionModel[] = [
    {
        userName: "Alejandro Vielma",
        caseCompoundKey: "GY_24_24_123",
        registryDate: new Date("01/01/2025"),
        actionNumber: 1,
        idCase: 1,
        notes: null,
        userId: "3112312",
        userNacionality: "V",
        description: "Actualización de expediente: Incorporación de boleta de notificación."
    },
    {
        userName: "Pedro Carvajal",
        caseCompoundKey: "GY_24_24_124",
        registryDate: new Date("01/01/2025"),
        actionNumber: 2,
        idCase: 2,
        notes: null,
        userId: "31512340",
        userNacionality: "V",
        description: "Envío de reporte mensual de avances estratégicos."
    },
    {
        userName: "Daniel Carreño",
        caseCompoundKey: "GY_24_24_125",
        registryDate: new Date("01/01/2025"),
        actionNumber: 3,
        idCase: 3,
        notes: null,
        userId: "31522270",
        userNacionality: "V",
        description: "Redacción de recurso de apelación."
    },
];

function DashBoard() {
    const navigate = useNavigate()

    return (
        <LateralMenuLayer locationId='home'>
            <div className="flex flex-col gap-3 h-full">
                <section className="flex">
                    <Button className="h-14 w-96" onClick={() => navigate('/crearCaso')}>
                        Nuevo Caso
                    </Button>
                </section>
                <section className="grid grid-cols-6 gap-3 flex-1 min-h-0">
                    <Box className="col-span-4 h-full flex flex-col gap-2">
                        <span className="flex items-center justify-between pb-2">
                            <h2 className="text-label-small text-onSurface">Ultimas acciones</h2>
                            <Button icon={<Search />} />
                        </span>
                        
                        <span className="px-0 py-2 text-body-small text-onSurface/70 border-b border-onSurface/10">
                            <ul className="flex gap-5">
                                <li className="flex-1">
                                    <p>Usuario</p>
                                </li>
                                <li className="flex-1">
                                    <p>ID Caso</p>
                                </li>
                                <li className="flex-1">
                                    <p>Fecha Creacion</p>
                                </li>
                                <li className="flex-3">
                                    <p>Descripcción</p>
                                </li>
                            </ul>
                        </span>

                        <div className="flex flex-col gap-2 flex-11">
                            {mockActions.map((action, index) => (
                                <AccionCard 
                                    key={index}
                                    caseAction={action}
                                />
                            ))}
                        </div>
                    </Box>
                    <Box className="col-span-2 h-fit flex flex-col">
                        <h2 className="text-label-small text-onSurface mb-4">Estado de Casos</h2>
                        <div className="flex-1 flex mx-4 max-w-72">
                            <CasesDonutChart />
                        </div>
                    </Box>
                </section>
            </div>
        </LateralMenuLayer>
    );
}
export default DashBoard;