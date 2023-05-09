import { Document, Page, Text, View, StyleSheet, PDFViewer, Font} from '@react-pdf/renderer';
import InvoiceHeader from './components/InvoiceHeader';
import InvoiceFooter from './components/InvoiceFooter';
import InvoicePaymentDetail from './components/InvoicePaymentDetail';
import InvoiceCustomerDetail from './components/InvoiceCustomerDetail';
import ItemsTable from '@/common/components/InvoiceTable/ItemsTable';
import CustomFont from './components/customFont';
import {IInvoiceProps, IDictionary} from './components/interface';
import dataItemDescription from './components/dataItemDescription';
import generatePDFList from './components/generatePDFList';

Font.register(CustomFont);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: '20px 30px',
    position: 'relative',
    backgroundColor: '#FFF',
    fontSize: '7px'
  },
  DescriptionTitle: {
    fontSize: "8.5px"
  }
});



// Create Document Component
const Invoice = (props: IInvoiceProps) => {
  
  const planToPlanPrice: IDictionary<number> = {"Basic": 100, "Premium": 7500, "PremiumPro": 22500, "PremiumGold": 45000};
  const planToNewsPrice: IDictionary<number> = {"Basic": 0, "Premium": 2500, "PremiumPro": 7500, "PremiumGold": 15000};
  const planToEntity: IDictionary<number> = {"Basic": 0, "Premium": 100, "PremiumPro": 1000, "PremiumGold": 10000};
  const dataItems= [{
                    description: dataItemDescription(props),
                    unitPrice: planToPlanPrice[props.plan],
                    quantity: 1,
                  }];
  var total = planToPlanPrice[props.plan];
  if (props.addonNews){
    dataItems.push({
      description: <Text style={styles.DescriptionTitle}>AI Compliance News Alert</Text>,
      unitPrice: planToNewsPrice[props.plan],
      quantity: 1,
    })
    total = total + planToNewsPrice[props.plan];
  }

  if (!(['expire', 'pass', 'invalidplan', 'notfound'].includes(props.promocode))){
    var contentArray = [];
    var promoDiscount = 0;
    if (props.promotionalDiscount?.PRICE_PER){
      promoDiscount = total * (props.promotionalDiscount?.PRICE_PER / 100);
      const tempString = (props.promotionalDiscount?.PRICE_PER > 0) ? `${props.promotionalDiscount?.PRICE_PER}% EXTRA`: `${-1 * props.promotionalDiscount?.PRICE_PER}% OFF`
      contentArray.push(tempString);
    } else if (props.promotionalDiscount?.PRICE_ABS){
      promoDiscount = props.promotionalDiscount?.PRICE_ABS;
      const tempString = (props.promotionalDiscount?.PRICE_ABS > 0) ? `+ HKD ${props.promotionalDiscount?.PRICE_ABS}`: `- HKD ${-1 * props.promotionalDiscount?.PRICE_ABS}`
      contentArray.push(tempString);
    }
    if (props.promotionalDiscount?.QUOTA_PER){
      const tempString = `${planToEntity[props.plan] * (props.promotionalDiscount?.QUOTA_PER / 100)}% Entities`
      contentArray.push(tempString);
    } else if (props.promotionalDiscount?.QUOTA_ABS){
      const tempString = (props.promotionalDiscount?.QUOTA_ABS > 0) ? `+ ${props.promotionalDiscount?.QUOTA_ABS} Entities`: `- ${-1 * props.promotionalDiscount?.QUOTA_ABS} Entities`
      contentArray.push(tempString);
    } 
    const description = (props.promotionalDiscount.description) ? props.promotionalDiscount.description.map((object:any) => object.en) : [];
    const items = generatePDFList([...contentArray, ...description]);
    dataItems.push({
      description: 
      <View>
        <Text style={[styles.DescriptionTitle, {color: "#3989c6", paddingBottom: "5px"}]}>Promotional Code - {props.promocode}</Text>
        {items}
      </View>
      ,
      unitPrice: promoDiscount,
      quantity: 1,
    })
  }

  return (
    <div style={{height: "100vh", width: "100vw", overflow: "hidden"}}>
      <PDFViewer style={{height: "100%", width: "100%"}}>
        <Document>
          <Page size="A4" style={[styles.page, {fontFamily: "PrimaSerif"}]} wrap>
            <InvoiceHeader />
            <View style = {{display: "flex", textAlign: "center", paddingBottom: "10px"}}>
                <Text style = {{fontWeight: "heavy", fontSize: "27px"}}>Invoice / Quotation</Text>
            </View>
            <InvoiceCustomerDetail 
              customerName = {props.customerName} 
              address = {props.address} 
              billingNumber = {props.billingNumber} 
              billingDateString = {props.billingDateString}
            />
            <ItemsTable 
              data = {{ items: dataItems }} 
            />
            <InvoicePaymentDetail />
            <InvoiceFooter />
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
}

export default Invoice;