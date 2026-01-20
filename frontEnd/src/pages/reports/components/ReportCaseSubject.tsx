import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './charts/PieChart';
import { styleDocument } from "./ReportDocument";

// Colores predefinidos para las materias
const colors = ['#90EE90', '#4169E1', '#9370DB', '#FFD700', '#8B4513', '#FF6347', '#45B7D1', '#FF6B6B', '#5DADE2', '#EC7063'];

interface ReportCaseSubjectProps {
  data?: Array<{ materia: string; cantidad: number }>;
  loading?: boolean;
  error?: Error | null;
}

function ReportCaseSubject({ data = [], loading = false, error = null }: ReportCaseSubjectProps) {
  // Transformar datos de la API al formato esperado
  const caseSubjectData = data.map((item, index) => ({
    materia: item.materia || 'Sin nombre',
    cantidad: Number(item.cantidad) || 0,
    color: colors[index % colors.length]
  }));

  // Calcular porcentajes dinámicamente
  const totalCasos = caseSubjectData.reduce((sum, item) => sum + item.cantidad, 0);
  const dataWithPercentages = caseSubjectData.map(item => ({
    ...item,
    porcentaje: totalCasos > 0 ? (item.cantidad / totalCasos) * 100 : 0
  }));

  if (loading) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>Cargando datos...</Text>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  if (caseSubjectData.length === 0) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>No hay datos disponibles para el período seleccionado</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <PieChart 
              data={caseSubjectData.map(item => ({
                label: item.materia,
                value: item.cantidad,
                color: item.color
              }))}
              size={150}
              is3D={false}
              showLabels={false}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 8, maxWidth: 200 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
              Leyenda
            </Text>
            {dataWithPercentages.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  marginRight: 8
                }} />
                <Text style={{ fontSize: 10 }}>
                  {item.materia}: {item.cantidad} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

    </>
  );
}

export default ReportCaseSubject;
