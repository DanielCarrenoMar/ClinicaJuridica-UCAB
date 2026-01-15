

import { useState, useMemo, Fragment } from 'react';
import Box from '#components/Box.tsx';
import OptionCard from '#components/OptionCard.tsx';
import {
    FilePdf,
    ChartPie,
} from 'flowbite-react-icons/outline';
import {
    FileChartBar,
    CalendarEdit,
} from 'flowbite-react-icons/solid';
import DropdownCheck from '#components/DropdownCheck/DropdownCheck.tsx';
import DropdownOptionCheck from '#components/DropdownCheck/DropdownOptionCheck.tsx';
import { PDFViewer, usePDF } from '@react-pdf/renderer';
import ReportCaseSubject from './components/ReportCaseSubject';
import ReportDocument from './components/ReportDocument';
import LinkButton from '#components/LinkButton.tsx';
import LoadingSpinner from '#components/LoadingSpinner.tsx';

const reportOptions = [
    {
        id: 1,
        title: 'Casos por materia',
        description: 'Cantidad de casos separados por materia',
        icon: <ChartPie />,
        component: <ReportCaseSubject />
    },
    {
        id: 2,
        title: 'Casos por materia y ambito',
        description: 'Cantidad de casos agrupados por materia y separados en ambito',
        icon: <ChartPie />,
        component: <ReportCaseSubject />
    },
    {
        id: 3,
        title: 'Solicitantes y beneficiarios por sexo',
        description: 'Cantidad de solicitantes y beneficiarios separados por sexo',
        icon: <ChartPie />,
        component: null
    },
    {
        id: 4,
        title: 'Solicitantes y beneficiarios por estado',
        description: 'Cantidad de solicitantes y beneficiarios separados por estado',
        icon: <ChartPie />,
        component: null
    },
    {
        id: 5,
        title: 'Solicitantes y beneficiarios por parroquia',
        description: 'Cantidad de solicitantes y beneficiarios separados por parroquia',
        icon: <ChartPie />,
        component: null
    },
    {
        id: 6,
        title: 'Casos por tipo',
        description: 'Cantidad de casos separados por tipo',
        icon: <ChartPie />,
        component: null
    },
    {
        id: 7,
        title: 'Beneficiarios por parroquia',
        description: 'Cantidad de beneficiarios separados por parroquia',
        icon: <ChartPie />,
        component: null
    },
    {
        id: 8,
        title: 'Estudiantes involucrados por tipo',
        description: 'Cantidad de estudiantes involucrados separados por tipo',
        icon: <ChartPie />,
        component: null
    },
    {
        id: 9,
        title: 'Profesores involucrados por tipo',
        description: 'Cantidad de profesores involucrados separados por tipo',
        icon: <ChartPie />,
        component: null
    },
];

const dateRanges = [
    { value: '2025-15', label: '2025-15' },
    { value: '2025-30', label: '2025-30' },
];

function Reports() {
    const [selectedReportIds, setSelectedReportIds] = useState<number[]>([1]);
    const [selectedRanges, setSelectedRanges] = useState<(string | number)[]>(['2025-15']);

    const reportDoc = useMemo(() => {
        const selectedReports = reportOptions.filter(r => selectedReportIds.includes(r.id));
        return (
            <ReportDocument>
                {selectedReports.map(report => (
                    <Fragment key={report.id}>
                        {report.component}
                    </Fragment>
                ))}
            </ReportDocument>
        );
    }, [selectedReportIds]);

    const [instance] = usePDF({ document: reportDoc });

    const handleReportSelect = (id: number) => {
        setSelectedReportIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };


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
                    <LinkButton to={instance.url ?? '#'} download={"prueba.pdf"} variant="outlined" icon={<FilePdf />}>
                        Exportar PDF
                    </LinkButton>
                </span>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-3 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                    {reportOptions.map((option) => (
                        <OptionCard
                            className='h-32'
                            key={option.id}
                            title={option.title}
                            description={option.description}
                            icon={option.icon}
                            selected={selectedReportIds.includes(option.id)}
                            onClick={() => handleReportSelect(option.id)}
                        />
                    ))}
                </div>

                <div className="flex-2 p-6 pt-5 flex flex-col gap-3 border-l border-onSurface/10 bg-surface/20">
                    <section className="flex flex-col gap-3">
                        <div className="flex gap-2 items-center text-onSurface">
                            <CalendarEdit className="w-6 h-6" />
                            <h3 className="text-label-small font-normal">Rango del informe</h3>
                        </div>

                        <div className="w-full">
                            <DropdownCheck
                                label="Seleccionar rango"
                                selectedValues={selectedRanges}
                                onSelectionChange={setSelectedRanges}
                                showSelectedCountBadge={true}
                            >
                                {dateRanges.map((range) => (
                                    <DropdownOptionCheck key={range.value} value={range.value}>
                                        {range.label}
                                    </DropdownOptionCheck>
                                ))}
                            </DropdownCheck>
                        </div>
                    </section>

                    <section className="flex flex-col gap-3 overflow-hidden h-full relative">
                        {instance.error && (
                            <div className="flex-1 flex items-center justify-center text-error p-4 text-center">
                                <p>Ocurrió un error al generar el reporte. Por favor intente nuevamente.</p>
                            </div>
                        )}

                        {instance.loading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/50 backdrop-blur-sm">
                                <LoadingSpinner />
                            </div>
                        )}

                        {!instance.error && (
                            <PDFViewer className="w-full h-full" showToolbar={false}>
                                {reportDoc}
                            </PDFViewer>
                        )}
                    </section>
                </div>
            </div>
        </Box>
    );
}
export default Reports;
