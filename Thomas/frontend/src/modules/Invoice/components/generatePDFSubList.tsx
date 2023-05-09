import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    ul: {
      flexDirection: "column",
      width: 300
    },
    lili: { 
      flexDirection: "row", 
    },
    liliPrefix: {
      marginHorizontal: 24
    },
})

export default function generatePDFSubList(contentArray: Array<string>){
    const listItem = contentArray.map( (content) => 
        <View style={styles.lili}>
          <Text style={styles.liliPrefix}>•</Text>
          <Text>{content}</Text>
        </View>
    )
    return (
      <View style={styles.ul}>
        {listItem}
      </View>
    )
  }