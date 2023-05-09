import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    ul: {
      flexDirection: "column",
      width: 250
    },
    li: { 
      flexDirection: "row", 
      marginBottom: 2 
    },
    liPrefix: {
      marginHorizontal: 8
    }
})

export default function generatePDFList(contentArray: Array<string>){
    const listItem = contentArray.map( (content) => 
        <View style={styles.li}>
          <Text style={styles.liPrefix}>•</Text>
          <Text>{content}</Text>
        </View>
    )
    return (
      <View style={styles.ul}>
        {listItem}
      </View>
    )
  }