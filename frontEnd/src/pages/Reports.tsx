

import { useState } from 'react';
import Box from '#components/Box.tsx';
import Button from '#components/Button.tsx';
import OptionCard from '#components/OptionCard.tsx';
import Dropdown from '#components/Dropdown/Dropdown.tsx';
import DropdownOption from '#components/Dropdown/DropdownOption.tsx';
import {
    FileExport,
    FilePdf,
    ChartPie,
} from 'flowbite-react-icons/outline';
import {
    FileChartBar,
    CalendarEdit,
    FileLines
} from 'flowbite-react-icons/solid';

const reportOptions = [
    {
        id: 1,
        title: 'Casos Por Parroquia',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus nunc, porta non lectus sit amet.',
        icon: <ChartPie />
    },
    {
        id: 2,
        title: 'Casos Por Mes',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus nunc, porta non lectus sit amet.',
        icon: <ChartPie />
    },
    {
        id: 3,
        title: 'Casos Por Semestre',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus nunc, porta non lectus sit amet.',
        icon: <ChartPie />
    },
    {
        id: 4,
        title: 'Casos Por Estado',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus nunc, porta non lectus sit amet.',
        icon: <ChartPie />
    },
    {
        id: 5,
        title: 'Casos Por Materia',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus nunc, porta non lectus sit amet.',
        icon: <ChartPie />
    },
    {
        id: 6,
        title: 'Casos Por Demanda',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lectus nunc, porta non lectus sit amet.',
        icon: <ChartPie />
    },
];

const dateRanges = [
    { value: '2023-2024', label: 'Septiembre 2023 - Febrero 2024' },
    { value: '2024-2025', label: 'Marzo 2024 - Agosto 2024' },
];

function Reports() {
    const [selectedReportId, setSelectedReportId] = useState<number | null>(1);
    const [selectedRange, setSelectedRange] = useState<string | number>('2023-2024');

    const handleReportSelect = (id: number) => {
        setSelectedReportId(id === selectedReportId ? null : id);
    };

    const selectedReport = reportOptions.find(r => r.id === selectedReportId);

    return (
        <Box className="p-0! h-full overflow-y-auto flex flex-col">
            <header className="bg-surface/70 flex items-center justify-between px-4 rounded-xl h-16">
                <span className="flex gap-3 items-center">
                    <FileChartBar className="size-6!" />
                    <div>
                        <h1 className="text-label-small">Generar Informe</h1>
                    </div>
                </span>
                <span className="flex items-center gap-4 h-full">
                    <Button variant="outlined" icon={<FileExport />}>
                        Exportar Word
                    </Button>
                    <Button variant="outlined" icon={<FilePdf />}>
                        Exportar PDF
                    </Button>
                </span>
            </header>

            {/* Content Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Side: Options Grid */}
                <div className="flex-3 p-4 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
                    {reportOptions.map((option) => (
                        <OptionCard
                            key={option.id}
                            title={option.title}
                            description={option.description}
                            icon={option.icon}
                            selected={selectedReportId === option.id}
                            onClick={() => handleReportSelect(option.id)}
                        />
                    ))}
                </div>

                {/* Right Side: Sidebar Controls */}
                <div className="flex-1 p-6 pt-5 flex flex-col gap-8 border-l border-onSurface/10 bg-surface/20">
                    {/* Rango del Informe Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center text-onSurface">
                            <CalendarEdit className="w-6 h-6" />
                            <h3 className="text-label-small font-normal">Rango del informe</h3>
                        </div>

                        <div className="w-full">
                            <Dropdown
                                label="Seleccionar rango"
                                selectedValue={selectedRange}
                                onSelectionChange={setSelectedRange}
                                triggerClassName="w-full bg-surface border-2 border-onSurface/10 hover:border-onSurface/30"
                            >
                                {dateRanges.map((range) => (
                                    <DropdownOption key={range.value} value={range.value}>
                                        {range.label}
                                    </DropdownOption>
                                ))}
                            </Dropdown>
                        </div>
                    </div>

                    {/* Resumen de Reporte Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center text-onSurface">
                            <FileLines className="w-6 h-6" />
                            <h3 className="text-label-small font-normal">Resumen de Reporte</h3>
                        </div>

                        <div className="pl-8">
                            {selectedReport ? (
                                <div className="flex flex-col gap-1 animate-fade-in-down animate-duration-300">
                                    <p className="text-body-medium font-medium text-onSurface">
                                        {selectedReport.title}
                                    </p>
                                    <p className="text-body-small text-onSurface/70">
                                        Rango: {dateRanges.find(r => r.value === selectedRange)?.label}
                                    </p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                                </div>
                            ) : (
                                <p className="text-body-small text-onSurface/50 italic">
                                    Seleccione un tipo de reporte para ver el resumen
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
}
export default Reports;
