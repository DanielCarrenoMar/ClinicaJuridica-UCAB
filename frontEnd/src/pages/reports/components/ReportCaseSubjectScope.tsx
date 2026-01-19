import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './PieChart';
import { styleDocument } from "./ReportDocument";

// Datos de prueba para distribución de casos por materia y ámbito
const mockCaseSubjectScopeData = [
  // Materia Civil - Sucesiones
  { materia: 'Materia Civil', ambito: 'Sucesiones', subambito: 'Cesión de derecho sucesorales', cantidad: 5, color: '#90EE90' },
  { materia: 'Materia Civil', ambito: 'Sucesiones', subambito: 'Justificativos únicos y Universales Herederos', cantidad: 14, color: '#87CEEB' },
  { materia: 'Materia Civil', ambito: 'Sucesiones', subambito: 'Particiones', cantidad: 8, color: '#4169E1' },
  
  // Materia Civil - Familia Tribunales Ordinarios
  { materia: 'Materia Civil', ambito: 'Familia Tribunales Ordinarios', subambito: 'Divorcios', cantidad: 12, color: '#6495ED' },
  { materia: 'Materia Civil', ambito: 'Familia Tribunales Ordinarios', subambito: 'Pensiones alimenticias', cantidad: 18, color: '#9370DB' },
  { materia: 'Materia Civil', ambito: 'Familia Tribunales Ordinarios', subambito: 'Filiación', cantidad: 6, color: '#BA55D3' },
  
  // Materia Civil - Personas
  { materia: 'Materia Civil', ambito: 'Personas', subambito: 'Cambios de nombre', cantidad: 3, color: '#FF6347' },
  { materia: 'Materia Civil', ambito: 'Personas', subambito: 'Interdicciones', cantidad: 4, color: '#FFD700' },
  { materia: 'Materia Civil', ambito: 'Personas', subambito: 'Tutelas', cantidad: 7, color: '#FFA500' },
  
  // Materia Civil - Otros
  { materia: 'Materia Civil', ambito: 'Otros', subambito: 'Contratos', cantidad: 9, color: '#8B4513' },
  { materia: 'Materia Civil', ambito: 'Otros', subambito: 'Arrendamientos', cantidad: 11, color: '#D2691E' },
  
  // Otras materias
  { materia: 'Materia Penal', ambito: 'Judicial', subambito: 'Delitos contra la propiedad', cantidad: 15, color: '#DC143C' },
  { materia: 'Materia Penal', ambito: 'Judicial', subambito: 'Delitos contra las personas', cantidad: 20, color: '#B22222' },
  
  { materia: 'Materia Laboral', ambito: 'Judicial', subambito: 'Despidos injustificados', cantidad: 25, color: '#4682B4' },
  { materia: 'Materia Laboral', ambito: 'Judicial', subambito: 'Accidentes laborales', cantidad: 13, color: '#5F9EA0' },
  
  { materia: 'Materia Mercantil', ambito: 'Judicial', subambito: 'Quiebras', cantidad: 4, color: '#CD853F' },
  { materia: 'Materia Mercantil', ambito: 'Judicial', subambito: 'Sociedades comerciales', cantidad: 7, color: '#DEB887' },
];

// Funciones para agrupar y procesar datos
const groupByMateria = (data: typeof mockCaseSubjectScopeData) => {
  const grouped: Record<string, typeof mockCaseSubjectScopeData> = {};
  data.forEach(item => {
    if (!grouped[item.materia]) {
      grouped[item.materia] = [];
    }
    grouped[item.materia].push(item);
  });
  return grouped;
};

const groupByAmbito = (data: typeof mockCaseSubjectScopeData) => {
  const grouped: Record<string, typeof mockCaseSubjectScopeData> = {};
  data.forEach(item => {
    const key = `${item.materia} - ${item.ambito}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  return grouped;
};

const calculatePercentages = (data: typeof mockCaseSubjectScopeData) => {
  const total = data.reduce((sum, item) => sum + item.cantidad, 0);
  return data.map(item => ({
    ...item,
    porcentaje: (item.cantidad / total) * 100
  }));
};

function ReportCaseSubjectScope() {
  const groupedByMateria = groupByMateria(mockCaseSubjectScopeData);
  
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia y Ámbito</Text>
      
      {Object.entries(groupedByMateria).map(([materia, materiaData]) => {
        // Gráfico principal de la materia (agrupado por ámbito)
        const ambitoGroups = groupByAmbito(materiaData);
        const materiaChartData = Object.entries(ambitoGroups).map(([ambitoKey, ambitoData]) => ({
          label: ambitoKey.split(' - ')[1], // Solo el nombre del ámbito
          value: ambitoData.reduce((sum, item) => sum + item.cantidad, 0),
          color: ambitoData[0].color
        }));
        
        return (
          <View key={materia} style={styleDocument.section}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              {materia}
            </Text>
            
            {/* Gráfico principal de la materia por ámbito */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <PieChart 
                  data={materiaChartData}
                  size={120}
                  is3D={false}
                  showLabels={false}
                />
              </View>
              <View style={{ flexDirection: 'column', gap: 6, maxWidth: 180 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 3 }}>
                  Distribución por Ámbito
                </Text>
                {materiaChartData.map((item, index) => {
                  const total = materiaChartData.reduce((sum, i) => sum + i.value, 0);
                  const porcentaje = (item.value / total) * 100;
                  return (
                    <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 3 }}>
                      <View style={{
                        width: 10,
                        height: 10,
                        backgroundColor: item.color,
                        marginRight: 6
                      }} />
                      <Text style={{ fontSize: 9 }}>
                        {item.label}: {item.value} ({porcentaje.toFixed(1)}%)
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
            
            {/* Gráficos individuales por ámbito con subambitos */}
            {Object.entries(ambitoGroups).map(([ambitoKey, ambitoData]) => {
              const ambitoName = ambitoKey.split(' - ')[1];
              const subambitoChartData = ambitoData.map(item => ({
                label: item.subambito,
                value: item.cantidad,
                color: item.color
              }));
              const subambitoWithPercentages = calculatePercentages(ambitoData);
              
              return (
                <View key={ambitoKey} style={{ marginTop: 15, paddingTop: 10, borderTop: '1pt solid #ccc' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                    {ambitoName}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                      <PieChart 
                        data={subambitoChartData}
                        size={100}
                        is3D={false}
                        showLabels={false}
                      />
                    </View>
                    <View style={{ flexDirection: 'column', gap: 4, maxWidth: 160 }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 2 }}>
                        Detalle
                      </Text>
                      {subambitoWithPercentages.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 2 }}>
                          <View style={{
                            width: 8,
                            height: 8,
                            backgroundColor: item.color,
                            marginRight: 4
                          }} />
                          <Text style={{ fontSize: 8 }}>
                            {item.subambito}: {item.cantidad} ({item.porcentaje.toFixed(1)}%)
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </>
  );
}

export default ReportCaseSubjectScope;
