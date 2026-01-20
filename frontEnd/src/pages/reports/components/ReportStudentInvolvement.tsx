import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './charts/PieChart';
import { styleDocument } from "./styleData";

interface StudentInvolvementData {
  tipo?: string;
  label?: string;
  cantidad?: number;
  value?: number;
}

interface ReportStudentInvolvementProps {
  data?: StudentInvolvementData[];
  loading?: boolean;
  error?: Error | null;
}

function ReportStudentInvolvement({ data, loading, error }: ReportStudentInvolvementProps) {
  // Si está cargando, mostrar mensaje
  if (loading) {
    return (
      <>
        <Text style={styleDocument.title}>Estudiantes Involucrados por Tipo</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>
            Cargando datos...
          </Text>
        </View>
      </>
    );
  }

  // Si hay error, mostrar mensaje de error
  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Estudiantes Involucrados por Tipo</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!data || data.length === 0) {
    return (
      <>
        <Text style={styleDocument.title}>Estudiantes Involucrados por Tipo</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>
            No hay datos disponibles para este reporte
          </Text>
        </View>
      </>
    );
  }

  // Transformar los datos del backend al formato que espera PieChart
  const transformedData = data.map((item, index) => {
    const label = item.tipo || item.label || `Tipo ${index + 1}`;
    const value = item.cantidad || item.value || 0;
    
    // Generar colores consistentes
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const color = colors[index % colors.length];
    
    return {
      label,
      value,
      color
    };
  });

  // Calcular porcentajes dinámicamente
  const totalEstudiantes = transformedData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentages = transformedData.map(item => ({
    ...item,
    porcentaje: (item.value / totalEstudiantes) * 100
  }));

  return (
    <>
      <Text style={styleDocument.title}>Estudiantes Involucrados por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <PieChart 
              data={transformedData}
              size={180}
              is3D={false}
              showLabels={false}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 6, maxWidth: 180 }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 3 }}>
              Distribución por Tipo
            </Text>
            {dataWithPercentages.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 3 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  marginRight: 8,
                  flexShrink: 0
                }} />
                <Text style={{ fontSize: 10, flex: 1 }}>
                  {item.label}: {item.value} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

export default ReportStudentInvolvement;
