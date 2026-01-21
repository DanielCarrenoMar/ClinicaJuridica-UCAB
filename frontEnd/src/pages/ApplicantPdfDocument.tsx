
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { ApplicantModel } from '#domain/models/applicant.ts';
import { characteristicsData, educationLevelData, workConditionData, activityConditionData } from '#domain/seedData.ts';
import { calculateAge } from '../utils/dateUtils.ts';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0056b3',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    section: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#2c3e50',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 2,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: '40%',
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        flex: 1,
        color: '#000',
    },
    noPresenta: {
        fontStyle: 'italic',
        color: '#888',
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    badge: {
        backgroundColor: '#e6f2ff',
        padding: '2 5',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#b3d7ff',
        fontSize: 8,
    }
});

const DisplayValue = ({ value }: { value?: string | number | null | boolean }) => {
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || value === '—') {
        return <Text style={styles.noPresenta}>No presenta</Text>;
    }
    if (typeof value === 'boolean') {
        return <Text>{value ? 'Sí' : 'No'}</Text>;
    }
    return <Text>{value}</Text>;
};

const getCharacteristicOption = (characteristicName: string, index?: number) => {
    if (index === undefined) return null;
    const options = characteristicsData.find((c) => c.name === characteristicName)?.options ?? [];
    return options[index] ?? null;
};

interface ApplicantPdfDocumentProps {
    data: ApplicantModel;
    type: string;
}

const ApplicantPdfDocument = ({ data, type }: ApplicantPdfDocumentProps) => {
    const services = data.servicesIdAvailable?.map(id => {
        const options = characteristicsData.find(c => c.name === 'Artefactos Domesticos, bienes o servicios del hogar')?.options ?? [];
        return options[id - 1];
    }).filter(Boolean);

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Ficha de {type}</Text>
                        <Text style={styles.subtitle}>Información socioeconómica registrada</Text>
                    </View>
                    <View style={{ textAlign: 'right' }}>
                        <Text style={{ fontSize: 10, color: '#666' }}>Fecha: {new Date().toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Identificación</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nombre Completo:</Text>
                        <View style={styles.value}><DisplayValue value={data.fullName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Cédula:</Text>
                        <View style={styles.value}><DisplayValue value={data.identityCard} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Nacionalidad:</Text>
                        <View style={styles.value}><DisplayValue value={data.idNationality === 'V' ? 'Venezolana' : data.idNationality === 'E' ? 'Extranjera' : 'Jurídica'} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Sexo:</Text>
                        <View style={styles.value}><DisplayValue value={data.gender} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Fecha de Nacimiento:</Text>
                        <View style={styles.value}><DisplayValue value={data.birthDate?.toLocaleDateString()} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Edad:</Text>
                        <View style={styles.value}><DisplayValue value={data.birthDate ? calculateAge(data.birthDate) : null} /></View>
                    </View>
                    {type !== 'Beneficiario' && (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>Correo Electrónico:</Text>
                                <View style={styles.value}><DisplayValue value={data.email} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Teléfono Celular:</Text>
                                <View style={styles.value}><DisplayValue value={data.cellPhone} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Teléfono Local:</Text>
                                <View style={styles.value}><DisplayValue value={data.homePhone} /></View>
                            </View>
                        </>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ubicación</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Estado:</Text>
                        <View style={styles.value}><DisplayValue value={data.stateName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Municipio:</Text>
                        <View style={styles.value}><DisplayValue value={data.municipalityName} /></View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Parroquia:</Text>
                        <View style={styles.value}><DisplayValue value={data.parishName} /></View>
                    </View>
                </View>

                {type !== 'Beneficiario' && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Información Familiar y Laboral</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Estado Civil:</Text>
                                <View style={styles.value}><DisplayValue value={data.maritalStatus} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Concubinato:</Text>
                                <View style={styles.value}><DisplayValue value={data.isConcubine} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Educación alcanzada:</Text>
                                <View style={styles.value}><DisplayValue value={data.applicantEducationLevel ? educationLevelData[data.applicantEducationLevel - 1]?.name : null} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Tiempo de estudio:</Text>
                                <View style={styles.value}><DisplayValue value={data.applicantStudyTime} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Condición de Trabajo/Actividad:</Text>
                                <View style={styles.value}>
                                    <DisplayValue value={
                                        data.workConditionId ? workConditionData[data.workConditionId - 1]?.name :
                                            data.activityConditionId ? activityConditionData[data.activityConditionId - 1]?.name : null
                                    } />
                                </View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Ingresos mensuales del hogar:</Text>
                                <View style={styles.value}><DisplayValue value={data.monthlyIncome} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Personas en la vivienda:</Text>
                                <View style={styles.value}><DisplayValue value={data.memberCount} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Personas que trabajan:</Text>
                                <View style={styles.value}><DisplayValue value={data.workingMemberCount} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Personas que no trabajan:</Text>
                                <View style={styles.value}>
                                    <DisplayValue value={(data.memberCount || 0) - (data.workingMemberCount || 0)} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Información de Vivienda</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Tipo de Vivienda:</Text>
                                <View style={styles.value}><DisplayValue value={getCharacteristicOption('Tipo de Vivienda', data.houseType)} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Material de Piso:</Text>
                                <View style={styles.value}><DisplayValue value={getCharacteristicOption('Material del piso', data.floorMaterial)} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Material de Paredes:</Text>
                                <View style={styles.value}><DisplayValue value={getCharacteristicOption('Material de las paredes', data.wallMaterial)} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Material de Techo:</Text>
                                <View style={styles.value}><DisplayValue value={getCharacteristicOption('Material del techo', data.roofMaterial)} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Agua Potable:</Text>
                                <View style={styles.value}><DisplayValue value={getCharacteristicOption('Servicio de agua potable', data.potableWaterService)} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Aguas Negras:</Text>
                                <View style={styles.value}><DisplayValue value={getCharacteristicOption('Eliminacion de excretas (aguas negras)', data.sewageService)} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Servicio de Aseo:</Text>
                                <View style={styles.value}><DisplayValue value={getCharacteristicOption('Servicio de aseo', data.cleaningService)} /></View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Servicios/Artefactos Disponibles:</Text>
                                <View style={styles.value}>
                                    {services && services.length > 0 ? (
                                        <View style={styles.badgeContainer}>
                                            {services.map((s, i) => (
                                                <Text key={i} style={styles.badge}>{s}</Text>
                                            ))}
                                        </View>
                                    ) : (
                                        <Text style={styles.noPresenta}>No presenta</Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    </>
                )}
            </Page>
        </Document>
    );
};

export default ApplicantPdfDocument;
