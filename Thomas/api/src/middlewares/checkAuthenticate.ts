import express from "express";
import CryptoJS from 'crypto-js';
import moment from 'moment';
import Locals from '../providers/Locals';

// Setted in tsoa.json
export async function expressAuthentication(
  request: any,
  securityName: string,
  scopes?: string[]
): Promise<any> {

  console.log('-----------------Check Authentication-------------------');

  console.log(request.headers)
  const data = request.session;
  const inputToken = request.headers.csrftoken;
  console.log('isLogin : %s' , data.isLogin);
  console.log('csrfToken from header: %s' , request.headers.csrftoken);
  console.log('csrfToken verification success : %s' , data.csrfToken === inputToken);
  console.log('test : %s' , data.test);
  console.log('--------------------------------------------------------');
  if (!data.isLogin || inputToken==undefined || !data.csrfToken == inputToken){
    return Promise.reject(new Error("Unauthorized"));
  }

  // TODO: Add Different Permission
  //                      Admin             Normal User       CDD Approval User                           ETC Transaction Approval User
  const UserRoles =     [ "CA",             "CU", "RU",       "KYC_L", "KYC_V", "KYC_A1", "KYC_A2",       "KYC_O", "KYC_CO",  "KYC_AC"];
  //                      Platform Admin    Sales Admin
  const AdminRoles =    [ "PA",             "SA"                                                                                      ];
  //                      Read Only User    Read Only KYC User
  const readOnlyRoles = [ "RU",             "KYC_O"                                                                                   ];

  const roles = ["CA", "CU", "RU", "PA", "SA", "KYC_A1", "KYC_A2", "KYC_V", "KYC_L", "KYC_O",  "KYC_CO",  "KYC_AC"];
  if (securityName === "isuser") {
    // TODO: check User Role
    return data;
  }

}