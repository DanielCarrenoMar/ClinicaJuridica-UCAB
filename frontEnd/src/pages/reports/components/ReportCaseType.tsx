import {
  Text,
  View,
} from "@react-pdf/renderer";
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de casos por tipo
const mockCaseTypeData = [
  { tipo: 'Asesoría', cantidad: 45, porcentaje: 35.2 },
  { tipo: 'Representación', cantidad: 38, porcentaje: 29.7 },
  { tipo: 'Consultoría', cantidad: 25, porcentaje: 19.5 },
  { tipo: 'Mediación', cantidad: 20, porcentaje: 15.6 },
];

const totalCasos = mockCaseTypeData.reduce((sum, item) => sum + item.cantidad, 0);

function ReportCaseType() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Tipo</Text>
      
      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Resumen General
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>
          Total de casos: {totalCasos}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 10 }}>
          Período: Enero - Diciembre 2024
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Distribución por Tipo de Caso
        </Text>
        
        {mockCaseTypeData.map((item, index) => (
          <View key={index} style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, flex: 2 }}>
              {item.tipo}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {item.cantidad}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'right' }}>
              {item.porcentaje.toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Gráfico de Distribución
        </Text>
        <View style={{ flexDirection: 'column', gap: 8 }}>
          {mockCaseTypeData.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 10, width: 80 }}>
                {item.tipo}
              </Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  height: 20,
                  width: `${item.porcentaje * 3}px`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index],
                  borderRadius: 2,
                }} />
                <Text style={{ fontSize: 10, marginLeft: 8 }}>
                  {item.porcentaje.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          {mockCaseTypeData.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 5 }}>
              <View style={{
                width: 12,
                height: 12,
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][index],
                marginRight: 5
              }} />
              <Text style={{ fontSize: 10 }}>
                {item.tipo}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Análisis Detallado
        </Text>
        <Text style={styleDocument.parragraph}>
          Durante el período analizado, se ha observado que los casos de Asesoría representan la mayor 
          proporción con un 35.2% del total, seguidos por los casos de Representación con 29.7%. 
          La Consultoría y Mediación completan la distribución con 19.5% y 15.6% respectivamente.
        </Text>
        <Text style={styleDocument.parragraph}>
          Esta distribución sugiere que la mayoría de los usuarios requieren orientación legal directa,
          mientras que una porción significativa necesita representación formal en procesos judiciales.
        </Text>
      </View>

      <View style={styleDocument.pageNumber}>
        <Text render={({pageNumber, totalPages}) => `${pageNumber}/${totalPages}`} />
      </View>
    </>
  );
}

export default ReportCaseType;
