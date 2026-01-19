import { Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";
import { formatReportTitle } from "../../../utils/dateUtils";

export const styleDocument = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    margin: 15,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  parragraph: {
    fontSize: 11,
    textAlign: "justify",
    lineHeight: 1.6,
    margin: 10,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  }
});

interface DocumentProps {
    startDate?: Date;
    endDate?: Date;
    children?: React.ReactNode;
}

export default function ReportDocument({children, startDate, endDate}: DocumentProps) {
    // Convert children to array and render each section on its own page
    const childrenArray = Array.isArray(children) ? children : [children];
    
    // Generate report title with date range
    const reportTitle = startDate && endDate ? formatReportTitle(startDate, endDate) : "ESTADÍSTICAS CCJ";
    
    return (
        <Document>
            {childrenArray.map((child, index) => (
                <Page key={index} style={styleDocument.page}>
                    {/* Header with title and logo - only on first page */}
                    {index === 0 && (
                        <View style={styleDocument.header}>
                            <Text style={styleDocument.mainTitle}>{reportTitle}</Text>
                            <Text style={styleDocument.subtitle}>CENTRO DE CLÍNICA JURÍDICA</Text>
                        </View>
                    )}
                    
                    {child}
                    
                    <View style={styleDocument.pageNumber}>
                        <Text render={({pageNumber, totalPages}) => `${pageNumber}/${totalPages}`} />
                    </View>
                </Page>
            ))}
        </Document>
    )
}