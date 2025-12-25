import Box from "#components/Box.tsx";
import Button from "#components/Button.tsx";
import LateralMenuLayer from "#layers/LateralMenuLayer.tsx";
import AccionCard from "#components/ActionCard.tsx";
import CasesDonutChart from "#components/CasesDonutChart.tsx";
import { Search } from "flowbite-react-icons/outline";

const mockActions = [
    {
        name: "Alejandro Vielma",
        id: "GY_24_24_123",
        date: "01/01/2025",
        description: "Actualización de expediente: Incorporación de boleta de notificación."
    },
    {
        name: "Pedro Carvajal",
        id: "GY_24_24_124",
        date: "02/01/2025",
        description: "Envío de reporte mensual de avances estratégicos."
    },
    {
        name: "Daniel Carreño",
        id: "GY_24_24_125",
        date: "03/01/2025",
        description: "Redacción de recurso de apelación."
    },
    {
        name: "Alejandro Vielma",
        id: "GY_24_24_123",
        date: "01/01/2025",
        description: "Actualización de expediente: Incorporación de boleta de notificación."
    },
    {
        name: "Pedro Carvajal",
        id: "GY_24_24_124",
        date: "02/01/2025",
        description: "Envío de reporte mensual de avances estratégicos."
    },
    {
        name: "Daniel Carreño",
        id: "GY_24_24_125",
        date: "03/01/2025",
        description: "Redacción de recurso de apelación."
    },
    {
        name: "Alejandro Vielma",
        id: "GY_24_24_123",
        date: "01/01/2025",
        description: "Actualización de expediente: Incorporación de boleta de notificación."
    },
    {
        name: "Pedro Carvajal",
        id: "GY_24_24_124",
        date: "02/01/2025",
        description: "Envío de reporte mensual de avances estratégicos."
    },
    {
        name: "Daniel Carreño",
        id: "GY_24_24_125",
        date: "03/01/2025",
        description: "Redacción de recurso de apelación."
    },
    {
        name: "Alejandro Vielma",
        id: "GY_24_24_123",
        date: "01/01/2025",
        description: "Actualización de expediente: Incorporación de boleta de notificación."
    },
    {
        name: "Pedro Carvajal",
        id: "GY_24_24_124",
        date: "02/01/2025",
        description: "Envío de reporte mensual de avances estratégicos."
    },
    {
        name: "Daniel Carreño",
        id: "GY_24_24_125",
        date: "03/01/2025",
        description: "Redacción de recurso de apelación."
    },
    {
        name: "Alejandro Vielma",
        id: "GY_24_24_123",
        date: "01/01/2025",
        description: "Actualización de expediente: Incorporación de boleta de notificación."
    },
    {
        name: "Pedro Carvajal",
        id: "GY_24_24_124",
        date: "02/01/2025",
        description: "Envío de reporte mensual de avances estratégicos."
    },
    {
        name: "Daniel Carreño",
        id: "GY_24_24_125",
        date: "03/01/2025",
        description: "Redacción de recurso de apelación."
    },
    {
        name: "Emilio Falconi",
        id: "GY_24_24_126",
        date: "04/01/2025",
        description: "Aprobación de estrategia de defensa técnica."
    }
];

function DashBoard() {
    return (
        <LateralMenuLayer locationId='home'>
            <div className="flex flex-col gap-3 h-full">
                <section className="flex">
                    <Button className="h-14 w-3xs">
                        Nuevo Caso
                    </Button>
                </section>
                <section className="grid grid-cols-6 gap-3 flex-1 min-h-0">
                    <Box className="col-span-4 h-full flex flex-col gap-2">
                        <span className="flex items-center justify-between pb-2">
                            <h2 className="text-label-small text-onSurface">Ultimas acciones</h2>
                            <Button variant="outlined" icon={<Search/>} />
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
                                    name={action.name}
                                    id={action.id}
                                    date={action.date}
                                    description={action.description}
                                />
                            ))}
                        </div>
                    </Box>
                    <Box className="col-span-2 h-fit flex flex-col">
                        <h2 className="text-label-small text-onSurface mb-4">Estado de Casos</h2>
                        <div className="flex-1 flex items-start">
                            <CasesDonutChart />
                        </div>
                    </Box>
                </section>
            </div>
        </LateralMenuLayer>
    );
}
export default DashBoard;