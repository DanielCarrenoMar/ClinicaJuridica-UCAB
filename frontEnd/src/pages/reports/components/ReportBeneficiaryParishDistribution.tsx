import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument } from "./ReportDocument";

interface BeneficiaryParishData {
  parroquia?: string;
  label?: string;
  cantidad?: number;
  value?: number;
}

interface ReportBeneficiaryParishDistributionProps {
  data?: BeneficiaryParishData[];
  loading?: boolean;
  error?: Error | null;
}

function ReportBeneficiaryParishDistribution({ data, loading, error }: ReportBeneficiaryParishDistributionProps) {
  // Si está cargando, mostrar mensaje
  if (loading) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Beneficiarios por Parroquia</Text>
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
        <Text style={styleDocument.title}>Distribución de Beneficiarios por Parroquia</Text>
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
        <Text style={styleDocument.title}>Distribución de Beneficiarios por Parroquia</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>
            No hay datos disponibles para este reporte
          </Text>
        </View>
      </>
    );
  }

  // Transformar los datos del backend al formato que espera BarChart
  const transformedData = data.map((item, index) => {
    const label = item.parroquia || item.label || `Parroquia ${index + 1}`;
    const value = item.cantidad || item.value || 0;
    
    // Generar colores consistentes
    const colors = ['#45B7D1', '#FF6B6B', '#5DADE2', '#EC7063', '#48C9B0', '#F1948A', '#76D7C4'];
    const color = colors[index % colors.length];
    
    return {
      label,
      value,
      color
    };
  });

  // Calcular porcentajes dinámicamente
  const totalBeneficiarios = transformedData.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentages = transformedData.map(item => ({
    ...item,
    porcentaje: (item.value / totalBeneficiarios) * 100
  }));
    return (
    <>
      <Text style={styleDocument.title}>Distribución de Beneficiarios por Parroquia</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={transformedData}
              width={380}
              height={250}
              barWidth={22}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 380, flexShrink: 0, marginTop: 20 }}>
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
    </>
  );
}

export default ReportBeneficiaryParishDistribution;
