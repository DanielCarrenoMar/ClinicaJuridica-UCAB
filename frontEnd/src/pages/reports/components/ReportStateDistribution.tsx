import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportStateDistribution } from "#domain/useCaseHooks/userReport.ts";

interface ReportProps {
  startDate?: Date;
  endDate?: Date;
}

function ReportStateDistribution({ startDate, endDate }: ReportProps) {
  const { stateDistribution, error } = useGetReportStateDistribution(startDate, endDate);

  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Estado</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  const totalPersonas = stateDistribution.reduce((sum, item) => sum + item.count, 0);
  const data = stateDistribution.map((item, index) => ({
    label: `${item.type} - ${item.state}`,
    value: item.count,
    color: colors[index % colors.length],
    porcentaje: totalPersonas > 0 ? (item.count / totalPersonas) * 100 : 0
  }));

  const barChartData = data.map(item => ({
    label: item.label,
    value: item.value,
    color: item.color
  }));

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Estado</Text>

      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        {stateDistribution.length === 0 || totalPersonas === 0 ? (
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#666', padding: 20 }}>
            No se encontraron datos para el período seleccionado.
          </Text>
        ) : (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
              <View style={{ alignItems: 'center' }}>
                <BarChart
                  data={barChartData}
                  width={400}
                  height={280}
                  barWidth={20}
                />
              </View>
            </View>
            <View style={{ flexDirection: 'column', gap: 6, width: 400, flexShrink: 0, marginTop: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8 }}>
                Leyenda
              </Text>
              {data.map((item, index) => (
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
          </>
        )}
      </View>

    </>
  );
}

export default ReportStateDistribution;
