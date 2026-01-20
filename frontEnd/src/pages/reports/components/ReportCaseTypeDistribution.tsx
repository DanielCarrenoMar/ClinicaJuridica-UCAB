import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportCasesByServiceType } from "#domain/useCaseHooks/userReport.ts";

function ReportCaseTypeDistribution() {
  const { casesByServiceType, error } = useGetReportCasesByServiceType();

  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Casos por Tipo de Servicio Legal</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  const totalCasos = casesByServiceType.reduce((sum, item) => sum + item.count, 0);
  const data = casesByServiceType.map((item, index) => ({
    label: item.serviceType,
    value: item.count,
    color: colors[index % colors.length],
    porcentaje: totalCasos > 0 ? (item.count / totalCasos) * 100 : 0
  }));

  const barChartData = data.map(item => ({
    label: item.label,
    value: item.value,
    color: item.color
  }));

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={barChartData}
              width={350}
              height={250}
              barWidth={20}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 350, flexShrink: 0, marginTop: 20 }}>
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
      </View>

    </>
  );
}

export default ReportCaseTypeDistribution;
