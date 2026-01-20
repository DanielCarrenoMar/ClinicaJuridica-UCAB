import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportProfessorInvolvement } from "#domain/useCaseHooks/userReport.ts";

function ReportProfessorInvolvement() {
  const { professorInvolvement, error } = useGetReportProfessorInvolvement();

  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Profesores Involucrados por Tipo</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  const totalProfesores = professorInvolvement.reduce((sum, item) => sum + item.count, 0);
  const data = professorInvolvement.map((item, index) => ({
    label: item.type,
    value: item.count,
    color: colors[index % colors.length],
    porcentaje: totalProfesores > 0 ? (item.count / totalProfesores) * 100 : 0
  }));

  const barChartData = data.map(item => ({
    label: item.label,
    value: item.value,
    color: item.color
  }));

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Profesores Involucrados por Tipo</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent", flexDirection: 'column', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
          <View style={{ alignItems: 'center' }}>
            <BarChart 
              data={barChartData}
              width={320}
              height={220}
              barWidth={18}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'column', gap: 6, width: 320, flexShrink: 0, marginTop: 20 }}>
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

export default ReportProfessorInvolvement;
