import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  row: {
    float: "left",
    display: "flex",
    flexDirection: "row",
    height: "auto",
    fontSize: "9px",
    borderTop: "1px solid #fff",
  },
  description: {
    float: "left",
    width: "55%",
    backgroundColor: "#eee",
    fontSize: "7px",
    padding: '5px',
  },
  unitPrice: {
    float: "left",
    width: "15%",
    backgroundColor: "#ddd",
    padding: '5px',
    textAlign: 'right',
  },
  quantity: {
    float: "left",
    width: "13%",
    backgroundColor: "#eee",
    padding: '5px',
    textAlign: 'right',
  },
  amount: {
    float: "left",
    width: "17%",
    backgroundColor: "#3989c6",
    padding: '5px',
    color: "#fff",
    textAlign: 'right',
  },
});

const TableRow = ({ items }: { items: Array<any> }) => {
  const rows = items.map((item) => (
    <View style={styles.row}>
      <View style={styles.description}>{item.description}</View>
      <View style={styles.unitPrice}><Text>{(item.unitPrice > 0) ? 'HKD' : '- HKD'} {Math.abs(item.unitPrice).toLocaleString("en-US")}</Text></View>
      <View style={styles.quantity}><Text>{item.quantity.toLocaleString("en-US")}</Text></View>
      <View style={styles.amount}><Text>{(item.unitPrice > 0) ? 'HKD' : '- HKD'} {Math.abs(item.unitPrice * item.quantity).toLocaleString("en-US")}</Text></View>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default TableRow;