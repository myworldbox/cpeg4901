import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import TableRow from "./TableRow";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tableHeader: {
    backgroundColor: "#eee",
    color: "#000",
    fontWeight: "bold",
    fontSize: "10px",    
    padding: "5px",
  },
  tableFooter: {
    backgroundColor: "#fff",
    color: "#3989c6",
    fontSize: "10px",    
    padding: "5px 10px",
  },
});

interface IDictionary<T>{
  [key: string]: T;
}

const ItemsTable = ( {data}: {data: IDictionary<any>} ) => (
  <View style={styles.tableContainer}>
    <Text style={[styles.tableHeader, {width: '55%', textAlign: 'left'}]}>Description</Text>
    <Text style={[styles.tableHeader, {width: '15%', textAlign: 'right'}]}>Unit Price</Text>
    <Text style={[styles.tableHeader, {width: '13%', textAlign: 'right'}]}>Quantity</Text>
    <Text style={[styles.tableHeader, {width: '17%', textAlign: 'right'}]}>Amount</Text>
    <TableRow items={data.items} />
    <Text style={[styles.tableFooter, {width: '83%', textAlign: 'right'}]}>GRAND TOTAL</Text>
    <Text style={[styles.tableFooter, {width: '17%', textAlign: 'right'}]}>HKD {data.items.map((item: any) => item.unitPrice * item.quantity).reduce((partialSum: any, a: any) => partialSum + a, 0)}</Text>
  </View>
);

export default ItemsTable;