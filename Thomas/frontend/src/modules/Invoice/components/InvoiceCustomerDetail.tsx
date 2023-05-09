import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { ICustomerDetail } from './interface';
const styles = StyleSheet.create({
    sectionTwo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '10px 0 15px',
      fontSize: '12px',
      paddingBottom: '30px'
    },
    sectionTwoTitle: {
        fontSize: '12px',
        fontWeight: 'bold'
    },
    address: {
        fontSize: '8px',
    },
    billingNumber: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#3989c6'
    },
    updateDate: {
        fontSize: '8px'
    }
})

const InvoiceCustomerDetail = (props: ICustomerDetail) => (
    <View style={styles.sectionTwo}>
        <View>
            <Text style={styles.sectionTwoTitle}>To: {props.customerName}</Text>
            <Text style={styles.address}>{props.address}</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.billingNumber}>Billing No: {props.billingNumber}</Text>
            <Text style={styles.updateDate}>Date of Invoice / Quotation: {props.billingDateString}</Text>
        </View>
    </View>
)

export default InvoiceCustomerDetail;