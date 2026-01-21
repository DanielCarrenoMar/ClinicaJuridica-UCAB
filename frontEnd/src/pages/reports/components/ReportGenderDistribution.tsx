import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportGenderDistribution } from "#domain/useCaseHooks/userReport.ts";


interface ReportProps {
  startDate?: Date;
  endDate?: Date;
}

function ReportGenderDistribution({ startDate, endDate }: ReportProps) {
  const { genderDistribution, error } = useGetReportGenderDistribution(startDate, endDate);

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

  const totalPersonas = genderDistribution.reduce((sum, item) => sum + item.count, 0);
  const transformedData = genderDistribution.map((item, index) => ({
    label: `${item.type} - ${item.gender}`,
    value: Number(item.count) || 0,
    color: colors[index % colors.length],
    porcentaje: totalPersonas > 0 ? (item.count / totalPersonas) * 100 : 0
  }));

  return (
    <>
      <Text style={styleDocument.title}>Distribución de Solicitantes y Beneficiarios por Género</Text>

      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        {genderDistribution.length === 0 || totalPersonas === 0 ? (
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#666', padding: 20 }}>
            No se encontraron datos para el período seleccionado.
          </Text>
        ) : (
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
              {transformedData.map((item, index) => (
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
        )}
      </View>

    </>
  );
}

export default ReportGenderDistribution;
