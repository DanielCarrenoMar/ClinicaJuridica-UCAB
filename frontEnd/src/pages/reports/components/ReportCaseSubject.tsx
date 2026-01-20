import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './charts/PieChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportCasesBySubject } from "#domain/useCaseHooks/userReport.ts";



function ReportCaseSubject() {
  const { casesBySubject, error } = useGetReportCasesBySubject();

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

  const totalCasos = casesBySubject.reduce((sum, item) => sum + item.count, 0);
  const caseSubjectData = casesBySubject.map((item, index) => ({
    subject: item.subject || 'Sin nombre',
    count: Number(item.count) || 0,
    color: colors[index % colors.length],
    porcentaje: totalCasos > 0 ? (item.count / totalCasos) * 100 : 0
  }));

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia Jurídica</Text>
      
      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center' }}>
            <PieChart 
              data={caseSubjectData.map(item => ({
                label: item.subject,
                value: item.count,
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
            {caseSubjectData.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color,
                  marginRight: 8
                }} />
                <Text style={{ fontSize: 10 }}>
                  {item.subject}: {item.count} ({item.porcentaje.toFixed(1)}%)
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
