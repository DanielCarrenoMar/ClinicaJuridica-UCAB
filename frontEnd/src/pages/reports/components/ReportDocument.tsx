import { Document, Page, StyleSheet, View, Text } from "@react-pdf/renderer";

export const styleDocument = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
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
    
    children?: React.ReactNode;
}

export default function ReportDocument({children}: DocumentProps) {
    // Convert children to array and render each section on its own page
    const childrenArray = Array.isArray(children) ? children : [children];
    
    return (
        <Document>
            {childrenArray.map((child, index) => (
                <Page key={index} style={styleDocument.page}>
                    {child}
                    <View style={styleDocument.pageNumber}>
                        <Text render={({pageNumber, totalPages}) => `${pageNumber}/${totalPages}`} />
                    </View>
                </Page>
            ))}
        </Document>
    )
}