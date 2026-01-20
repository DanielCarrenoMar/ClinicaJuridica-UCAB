import {
  Text,
  View,
} from "@react-pdf/renderer";
import PieChart from './charts/PieChart';
import { styleDocument, colors } from "./styleData";
import { useGetReportCasesBySubjectScope } from "#domain/useCaseHooks/userReport.ts";

type CaseSubjectScopeData = {
  subject: string;
  scope: string;
  legal_area: string;
  value: number;
  color: string;
};

// Funciones para agrupar y procesar datos
const groupBySubject = (data: CaseSubjectScopeData[]) => {
  const grouped: Record<string, CaseSubjectScopeData[]> = {};
  data.forEach(item => {
    if (!grouped[item.subject]) {
      grouped[item.subject] = [];
    }
    grouped[item.subject].push(item);
  });
  return grouped;
};

const groupByScope = (data: CaseSubjectScopeData[]) => {
  const grouped: Record<string, CaseSubjectScopeData[]> = {};
  data.forEach(item => {
    const key = `${item.subject} - ${item.scope}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  return grouped;
};

const calculatePercentages = (data: CaseSubjectScopeData[]) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return data.map(item => ({
    ...item,
    porcentaje: total > 0 ? (item.value / total) * 100 : 0
  }));
};

function ReportCaseSubjectScope() {
  const { casesBySubjectScope, error } = useGetReportCasesBySubjectScope();

  if (error) {
    return (
      <>
        <Text style={styleDocument.title}>Distribución de Casos por Materia y Ámbito</Text>
        <View style={{ ...styleDocument.section, backgroundColor: "transparent" }}>
          <Text style={{ fontSize: 12, textAlign: 'center', color: 'red' }}>
            Error: {error.message}
          </Text>
        </View>
      </>
    );
  }

  const normalizedData: CaseSubjectScopeData[] = casesBySubjectScope.map((item, index) => ({
    subject: item.subject,
    scope: item.scope,
    legal_area: item.subScope,
    value: item.count,
    color: colors[index % colors.length]
  }));

  const groupedBySubject = groupBySubject(normalizedData);
  
  return (
    <>
      <Text style={styleDocument.title}>Distribución de Casos por Materia y Ámbito</Text>
      
      {Object.entries(groupedBySubject).map(([subject, subjectData]) => {
        // Gráfico principal de la materia (agrupado por ámbito)
        const scopeGroups = groupByScope(subjectData);
        const subjectChartData = Object.entries(scopeGroups).map(([scopeKey, scopeData]) => ({
          label: scopeKey.split(' - ')[1], // Solo el nombre del ámbito
          value: (scopeData as CaseSubjectScopeData[]).reduce((sum: number, item: CaseSubjectScopeData) => sum + item.value, 0),
          color: (scopeData as CaseSubjectScopeData[])[0].color
        }));
        
        return (
          <View key={subject} style={styleDocument.section}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
              {subject}
            </Text>
            
            {/* Gráfico principal de la materia por ámbito */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 20 }}>
              <View style={{ alignItems: 'center' }}>
                <PieChart 
                  data={subjectChartData}
                  size={120}
                  is3D={false}
                  showLabels={false}
                />
              </View>
              <View style={{ flexDirection: 'column', gap: 6, maxWidth: 180 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 3 }}>
                  Distribución por Ámbito
                </Text>
                {subjectChartData.map((item, index) => {
                  const total = subjectChartData.reduce((sum, i) => sum + i.value, 0);
                  const porcentaje = total > 0 ? (item.value / total) * 100 : 0;
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
            
            {/* Gráficos individuales por ámbito */}
            {Object.entries(scopeGroups).map(([scopeKey, scopeData]) => {
              const scopeName = scopeKey.split(' - ')[1];
              const scopeChartData = (scopeData as CaseSubjectScopeData[]).map(item => ({
                label: item.legal_area,
                value: item.value,
                color: item.color
              }));
              const scopeWithPercentages = calculatePercentages(scopeData as CaseSubjectScopeData[]);
              
              return (
                <View key={scopeKey} style={{ marginTop: 15, paddingTop: 10, borderTop: '1pt solid #ccc' }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                    {scopeName}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                      <PieChart 
                        data={scopeChartData}
                        size={100}
                        is3D={false}
                        showLabels={false}
                      />
                    </View>
                    <View style={{ flexDirection: 'column', gap: 4, maxWidth: 160 }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 2 }}>
                        Áreas Legales
                      </Text>
                      {scopeWithPercentages.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 2 }}>
                          <View style={{
                            width: 8,
                            height: 8,
                            backgroundColor: item.color,
                            marginRight: 4
                          }} />
                          <Text style={{ fontSize: 8 }}>
                            {item.legal_area}: {item.value} ({item.porcentaje.toFixed(1)}%)
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
