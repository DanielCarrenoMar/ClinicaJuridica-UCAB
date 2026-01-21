import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './charts/PieChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportStudentInvolvement } from "#domain/useCaseHooks/userReport.ts";

interface ReportProps {
  startDate?: Date;
  endDate?: Date;
}

function ReportStudentInvolvement({ startDate, endDate }: ReportProps) {
  const { studentInvolvement, error } = useGetReportStudentInvolvement(startDate, endDate);

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

  const totalEstudiantes = studentInvolvement.reduce((sum, item) => sum + item.count, 0);
  const transformedData = studentInvolvement.map((item, index) => ({
    label: item.type,
    value: item.count,
    color: colors[index % colors.length],
    porcentaje: totalEstudiantes > 0 ? (item.count / totalEstudiantes) * 100 : 0
  }));

  return (
    <>
      <Text style={styleDocument.title}>Estudiantes Involucrados por Tipo</Text>

      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        {studentInvolvement.length === 0 || totalEstudiantes === 0 ? (
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#666', padding: 20 }}>
            No se encontraron datos para el período seleccionado.
          </Text>
        ) : (
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
              {transformedData.map((item, index) => (
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
        )}
      </View>
    </>
  );
}

export default ReportStudentInvolvement;
