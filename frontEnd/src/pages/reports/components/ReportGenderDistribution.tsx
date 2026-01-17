import {
  Text,
  View,
} from "@react-pdf/renderer";
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución por género
const mockGenderData = [
  { categoria: 'Solicitantes', masculino: 85, femenino: 120, total: 205 },
  { categoria: 'Beneficiarios', masculino: 92, femenino: 143, total: 235 },
];

const granTotal = mockGenderData.reduce((sum, item) => sum + item.total, 0);

function ReportGenderDistribution() {
  return (
    <>
      <Text style={styleDocument.title}>Distribución por Género: Solicitantes y Beneficiarios</Text>
      
      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Resumen General
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 5 }}>
          Total de personas: {granTotal}
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 10 }}>
          Período: Enero - Diciembre 2024
        </Text>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Distribución por Género y Categoría
        </Text>
        
        <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1pt solid #ccc', paddingBottom: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 2 }}>Categoría</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Masculino</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Femenino</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'right' }}>Total</Text>
        </View>
        
        {mockGenderData.map((item, index) => (
          <View key={index} style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, flex: 2 }}>
              {item.categoria}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {item.masculino}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'center' }}>
              {item.femenino}
            </Text>
            <Text style={{ fontSize: 12, flex: 1, textAlign: 'right', fontWeight: 'bold' }}>
              {item.total}
            </Text>
          </View>
        ))}
        
        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1pt solid #ccc', paddingTop: 4 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 2 }}>Total General</Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
            {mockGenderData.reduce((sum, item) => sum + item.masculino, 0)}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>
            {mockGenderData.reduce((sum, item) => sum + item.femenino, 0)}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: 'bold', flex: 1, textAlign: 'right' }}>
            {granTotal}
          </Text>
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Gráfico de Distribución por Género
        </Text>
        <View style={{ flexDirection: 'column', gap: 8 }}>
          {mockGenderData.map((item, index) => (
            <View key={index}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 5 }}>
                {item.categoria}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 20 }}>
                <Text style={{ fontSize: 10, width: 60 }}>
                  Masculino
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    height: 15,
                    width: `${(item.masculino / item.total) * 200}px`,
                    backgroundColor: '#45B7D1',
                    borderRadius: 2,
                  }} />
                  <Text style={{ fontSize: 10, marginLeft: 8 }}>
                    {((item.masculino / item.total) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 20 }}>
                <Text style={{ fontSize: 10, width: 60 }}>
                  Femenino
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    height: 15,
                    width: `${(item.femenino / item.total) * 200}px`,
                    backgroundColor: '#FF6B6B',
                    borderRadius: 2,
                  }} />
                  <Text style={{ fontSize: 10, marginLeft: 8 }}>
                    {((item.femenino / item.total) * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', gap: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 12,
              height: 12,
              backgroundColor: '#45B7D1',
              marginRight: 5
            }} />
            <Text style={{ fontSize: 10 }}>
              Masculino
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 12,
              height: 12,
              backgroundColor: '#FF6B6B',
              marginRight: 5
            }} />
            <Text style={{ fontSize: 10 }}>
              Femenino
            </Text>
          </View>
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Análisis de Porcentajes
        </Text>
        
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Solicitantes:</Text> 
            Masculino {((mockGenderData[0].masculino / mockGenderData[0].total) * 100).toFixed(1)}%, 
            Femenino {((mockGenderData[0].femenino / mockGenderData[0].total) * 100).toFixed(1)}%
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>Beneficiarios:</Text> 
            Masculino {((mockGenderData[1].masculino / mockGenderData[1].total) * 100).toFixed(1)}%, 
            Femenino {((mockGenderData[1].femenino / mockGenderData[1].total) * 100).toFixed(1)}%
          </Text>
          <Text style={{ fontSize: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Total General:</Text> 
            Masculino {((mockGenderData.reduce((sum, item) => sum + item.masculino, 0) / granTotal) * 100).toFixed(1)}%, 
            Femenino {((mockGenderData.reduce((sum, item) => sum + item.femenino, 0) / granTotal) * 100).toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styleDocument.section}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>
          Observaciones
        </Text>
        <Text style={styleDocument.parragraph}>
          Se observa una mayor participación del género femenino tanto en solicitantes como en beneficiarios,
          representando aproximadamente el 58.5% del total. Esta tendencia es consistente con los patrones
          nacionales de búsqueda de servicios legales, donde las mujeres suelen mostrar mayor propensión
          a寻求 asesoría legal para diversos tipos de casos.
        </Text>
      </View>

          </>
  );
}

export default ReportGenderDistribution;
