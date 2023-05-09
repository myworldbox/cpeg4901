import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        bottom: '20px',
        left: '30px',
        width: '100%',
        textAlign: 'center',
        color: '#777',
        borderTop: '1px solid #aaa',
        padding: '3px 0'
    }
})

const InvoiceFooter = () => (
    <View style={[styles.footer]} fixed>
        <Text>This is a computer-generated document. no signature is required.</Text>
        <Text render={({ pageNumber }) => (
            `${pageNumber}`
        )} />
    </View>
)
export default InvoiceFooter;