import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument } from "./styleData";
import { useGetReportCasesByType } from "#domain/useCaseHooks/userReport.ts";
import { colors } from "./styleData";

function ReportCaseType() {
  const { casesByType, error} = useGetReportCasesByType()
  
  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Casos por Tipo</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  const totalCasos = casesByType.reduce((sum, item) => sum + item.count, 0);
  const data = casesByType.map((item, index) => ({
    ...item,
    porcentaje: (item.count / totalCasos) * 100,
    color: colors[index % colors.length]
  }));

  const barChartData = data.map(item => ({
    label: item.type,
    value: item.count,
    color: item.color
  }));

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={barChartData}
              width={300}
              height={200}
              barWidth={25}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 6, width: 280, flexShrink: 0 }}>
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
                  {item.type}: {item.count} ({item.porcentaje.toFixed(1)}%)
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

    </>
  );
}

export default ReportCaseType;
