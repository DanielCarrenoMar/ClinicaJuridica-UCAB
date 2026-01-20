import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument } from "./ReportDocument";

interface BeneficiaryData {
  label: string;
  value: number;
  color: string;
}

interface ReportBeneficiaryTypeDistributionProps {
  data?: BeneficiaryData[];
  loading?: boolean;
  error?: Error | null;
}

function ReportBeneficiaryTypeDistribution({ data, loading, error }: ReportBeneficiaryTypeDistributionProps) {
  // Si está cargando, mostrar mensaje
  if (loading) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Beneficiarios por Tipo</Text>
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
        <Text style={styleDocument.title}>Distribución de Beneficiarios por Tipo</Text>
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
        <Text style={styleDocument.title}>Distribución de Beneficiarios por Tipo</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center' }}>
            No hay datos disponibles para este reporte
          </Text>
        </View>
      </>
    );
  }

  // Calcular porcentajes dinámicamente
  const totalBeneficiarios = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentages = data.map(item => ({
    ...item,
    porcentaje: (item.value / totalBeneficiarios) * 100
  }));
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Beneficiarios por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={data}
              width={350}
              height={220}
              barWidth={40}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 8, width: 300, flexShrink: 0 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
              Resumen de Beneficiarios
            </Text>
            {dataWithPercentages.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <View style={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  marginRight: 10,
                  flexShrink: 0,
                  borderRadius: 2
                }} />
                <Text style={{ fontSize: 11, flex: 1 }}>
                  {item.label}: {item.value} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
            <View style={{ marginTop: 15, padding: 10, backgroundColor: '#F8F9FA', borderRadius: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 5 }}>
                Total General:
              </Text>
              <Text style={{ fontSize: 12 }}>
                {totalBeneficiarios} beneficiarios
              </Text>
            </View>
          </View>
        </View>
      </View>

      
    </>
  );
}

export default ReportBeneficiaryTypeDistribution;
