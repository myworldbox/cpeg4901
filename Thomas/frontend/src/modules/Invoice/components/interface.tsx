export interface IInvoiceProps{
    customerName: string;
    address: string;
    billingNumber: string;
    billingDateString: string;
    plan: string;
    promocode: string;
    promotionalDiscount: any;
    dtStart: Date;
    addonNews: boolean;
    session: string;
}

export interface ICustomerDetail{
    customerName: string;
    address: any;
    billingNumber: string;
    billingDateString: string;
}

export interface IDictionary<T>{
    [key: string]: T;
}
  