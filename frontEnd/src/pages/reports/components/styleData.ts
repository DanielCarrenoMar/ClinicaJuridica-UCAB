import { StyleSheet } from "@react-pdf/renderer";

export const colors = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc949'];

export const styleDocument = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontSize: 12,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
    letterSpacing: 0.6,
    lineHeight: 1.25,
  },
  logo: {
    width: 120,
    height: 40,
    marginRight: 12,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  subtitleText: {
    fontSize: 14,
    textAlign: "left",
    letterSpacing: 1.2,
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