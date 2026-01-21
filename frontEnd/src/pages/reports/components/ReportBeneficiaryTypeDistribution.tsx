import {
  Text,
  View,
} from "@react-pdf/renderer";
import BarChart from './charts/BarChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportBeneficiaryTypeDistribution } from "#domain/useCaseHooks/userReport.ts";

interface ReportProps {
  startDate?: Date;
  endDate?: Date;
}

function ReportBeneficiaryTypeDistribution({ startDate, endDate }: ReportProps) {
  const { beneficiaryTypeDistribution, error } = useGetReportBeneficiaryTypeDistribution(startDate, endDate);

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

  const totalBeneficiarios = beneficiaryTypeDistribution.reduce((sum, item) => sum + item.count, 0);
  const data = beneficiaryTypeDistribution.map((item, index) => ({
    label: item.type,
    value: item.count,
    color: colors[index % colors.length],
    porcentaje: totalBeneficiarios > 0 ? (item.count / totalBeneficiarios) * 100 : 0
  }));

  const barChartData = data.map(item => ({
    label: item.label,
    value: item.value,
    color: item.color
  }));
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Beneficiarios por Tipo</Text>

      <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
        {beneficiaryTypeDistribution.length === 0 || totalBeneficiarios === 0 ? (
          <Text style={{ fontSize: 12, textAlign: 'center', color: '#666', padding: 20 }}>
            No se encontraron datos para el período seleccionado.
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: 40 }}>
            <View style={{ alignItems: 'center' }}>
              <BarChart
                data={barChartData}
                width={350}
                height={220}
                barWidth={40}
              />
            </View>
            <View style={{ flexDirection: 'column', gap: 8, width: 300, flexShrink: 0 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
                Resumen de Beneficiarios
              </Text>
              {data.map((item, index) => (
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
        )}
      </View>


    </>
  );
}

export default ReportBeneficiaryTypeDistribution;
