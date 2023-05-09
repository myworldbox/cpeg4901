import { Text, View, StyleSheet } from '@react-pdf/renderer';
import generatePDFList from './generatePDFList';

const styles = StyleSheet.create({
    liTierTwo: {
      marginHorizontal: 48
    },
})

const InvoicePaymentDetail = () => (
    <View style={{fontWeight: 'bold'}}>
        <Text style={{textDecoration: 'underline', padding: '10px 0'}}>Terms and Conditions</Text>
        {generatePDFList(['The quotation is valid for 30 days from the date of issuance.','Your subscription will be automatically renewed for 1 year on the subscription end date, unless 90 days prior written notice is served to iFinGate before the expiry.'])}
        <Text style={{textDecoration: 'underline', padding: '10px 0'}}>Payment Details</Text>
        {generatePDFList(['For Direct Deposit:'])}
        <Text style={styles.liTierTwo}>SWIFT BIC: HSBCHKHHHKH</Text>
        <Text style={styles.liTierTwo}>Bank Name: The Hongkong and Shanghai Banking Corporation Limited</Text>
        <Text style={styles.liTierTwo}>Main Address: 1 Queen's Road Central, Hong Kong</Text>
        <Text style={styles.liTierTwo}>Bank Code: 004 (applicable to local RTGS/CHATS)</Text>
        <Text style={styles.liTierTwo}>Bank Account: iFinGate limited</Text>
        <Text style={[styles.liTierTwo, {paddingBottom: '10px'}]}>Bank Account number: 741-246375-838 (multi-currencies account)</Text>
        {generatePDFList(['For Payment via the Faster Payment System (FPS):'])}
        <Text style={styles.liTierTwo}>FPS ID: 3191939</Text>
        <Text style={[styles.liTierTwo, {paddingBottom: '10px'}]}>Bank Account: iFinGate limited</Text>
    </View>
)

export default InvoicePaymentDetail;