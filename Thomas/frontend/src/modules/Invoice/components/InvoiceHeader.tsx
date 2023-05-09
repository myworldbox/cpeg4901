import { Text, Image, Link, View, StyleSheet } from '@react-pdf/renderer';
import Logo from "public/assets/images/logo-group-with-subtitles.png";

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0 5px',
        marginBottom: '10px',
        borderBottom: '1px solid #3989c6'
    },
    logo: {
      width: "140px"
    },
    companyDetails: {
        width: '50%',
        textAlign: 'right',
        fontSize: '7.5px',
    },
    companyName: {
        fontSize: '12px',
        fontWeight: "heavy"
    },
})

const InvoiceHeader = () => (
    <View style={styles.header} fixed>
        <View>
            <Link src="https://www.ifingate.com">
            <Image src={Logo.src} style={styles.logo} />
            </Link>
        </View>
        <View style={styles.companyDetails}>
            <Text style={styles.companyName}>iFinGate Ltd</Text>
            <Text>Unit 417-18, 4/F, Core F, Cyberport 3,</Text>
            <Text>100 Cyberport Road, Hong Kong</Text>
            <Text>+852 3797-8938</Text>
            <Text>Email: <Link src="mailto:support@ifingate.com">cs@ifingate.com</Link></Text>
            <Text>www.ifingate.com</Text>
        </View>
    </View>
)
export default InvoiceHeader;