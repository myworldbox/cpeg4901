import { IDictionary } from "./interface";
import generatePDFList from "./generatePDFList";
import generatePDFSubList from "./generatePDFSubList";
import { Text, StyleSheet } from "@react-pdf/renderer";
import { Fragment } from 'react';


const styles = StyleSheet.create({
    DescriptionTitle: {
      fontSize: "8.5px"
    }
  });

const dataItemDescription = (props: any) => {
    const planToString: IDictionary<string> = {"Basic": "One Time Purchase", "Premium": "Premium Plan", "PremiumPro": "Premium Pro Plan", "PremiumGold": "Premium Gold Plan"};
    const planToEntity: IDictionary<number> = {"Basic": 0, "Premium": 100, "PremiumPro": 1000, "PremiumGold": 10000};
    const planToCompliance: IDictionary<Array<string>> = {"Basic": ['GST', 'GPEP', 'GAL'], "Premium": ['GST', 'GPEP', 'GAL', 'LC'], "PremiumPro": ['GST', 'GPEP', 'GAL', 'LC'], "PremiumGold": ['GST', 'GPEP', 'GAL', 'LC']};
    const planToFeatures: IDictionary<Array<string>> = {"Basic": ['CR', 'SH', 'GGSP'], "Premium": ['CR', 'SH', 'BS', 'GGSP'], "PremiumPro": ['CR', 'SH', 'BS', 'GGSP', 'OM', 'DASR'], "PremiumGold": ['CR', 'SH', 'BS', 'GGSP', 'OM', 'DASR']};
    const complianceMapping: IDictionary<string> = { 'GST': `Global Sanctions & Terrorism`, 'GPEP': `Global Politically Exposed Person`, 'GAL': `Global Alert Lists`, 'LC': `Litigation Checks` } //'LC': `Litigation Checks ${litigationCountriesString}` }
    const featuresMapping: IDictionary<string> = { 'CR': `Compliance Report`, 'SH': `Scan History`, 'BS': `Batch Screening`, 'GGSP': `Glance on Group's Scanned Position`, 'OM': `Ongoing Monitoring`, 'DASR': `Daily Alert Summary Report` }
    var dtEnd = new Date(props.dtStart);
    if (props.plan === 'Basic') dtEnd.setMonth(dtEnd.getMonth() + 3); else dtEnd.setFullYear(dtEnd.getFullYear() + 1); 

    const options: any = { day:"2-digit", month:"long", year:"numeric" };
    const dataItemPart1Title = generatePDFList([`From ${props.dtStart.toLocaleDateString("en-GB", options)} to ${dtEnd.toLocaleDateString("en-GB", options)}`, `Number of Entities: ${planToEntity[props.plan]}`, 'Compliance Database:']);
    const detaItemPart1 = generatePDFSubList(planToCompliance[props.plan].map( (ShortForm) => complianceMapping[ShortForm]));
    const dataItemFeatureTitle = generatePDFList(['Features:']);
    const dataItemFeature = generatePDFSubList(planToFeatures[props.plan].map( (ShortForm) => featuresMapping[ShortForm]));

    return (
        <Fragment>
          <Text style={[styles.DescriptionTitle, {color: "#3989c6", paddingBottom: "5px"}]}>iFinGate Anti-Money Laundering Screening System - {planToString[props.plan]}</Text>
          {dataItemPart1Title}
          {detaItemPart1}
          {dataItemFeatureTitle}
          {dataItemFeature}
        </Fragment>
    )
}

export default dataItemDescription;