import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument } from "./styleData";

// Interfaz para los datos del backend
interface GenderDataItem {
  tipo: string;
  genero: string;
  cantidad: number;
}

// Interfaz para los datos transformados (formato original)
interface GenderData {
  label: string;
  value: number;
  color: string;
}

interface ReportGenderDistributionProps {
  data?: GenderDataItem[];
  loading?: boolean;
  error?: Error | null;
}

// Colores predefinidos para géneros
const genderColors = {
  'Masculino': '#4169E1',
  'Femenino': '#FF69B4',
  'Otro': '#9370DB',
  'No especifica': '#808080'
};

function ReportGenderDistribution({ data = [], loading = false, error = null }: ReportGenderDistributionProps) {
  // Transformar datos del backend al formato esperado
  const transformedData: GenderData[] = data.map((item) => ({
    label: `${item.tipo} - ${item.genero}`,
    value: Number(item.cantidad) || 0,
    color: genderColors[item.genero as keyof typeof genderColors] || '#808080'
  }));

  if (loading) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Género</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>Cargando datos...</Text>
        </View>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Género</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  if (transformedData.length === 0) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Género</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>
            No hay datos disponibles para el período seleccionado
          </Text>
        </View>
      </>
    );
  }

  // Calcular porcentajes dinámicamente
  const totalPersonas = transformedData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentages = transformedData.map(item => ({
    ...item,
    porcentaje: totalPersonas > 0 ? (item.value / totalPersonas) * 100 : 0
  }));

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Género</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={transformedData}
              width={300}
              height={200}
              barWidth={25}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 6, width: 280, flexShrink: 0 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
              Leyenda
            </Text>
            {dataWithPercentages.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
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

export default ReportGenderDistribution;
