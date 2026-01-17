import { Document, Page, StyleSheet } from "@react-pdf/renderer";

export const styleDocument = StyleSheet.create({
  page: {
    backgroundColor: "#E4E4E4",
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
    return (
        <Document>
              <Page style={styleDocument.page}>
                    {children}
              </Page>
        </Document>
    )
}