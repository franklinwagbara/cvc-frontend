import { string } from "@amcharts/amcharts4/core";

export const APPLICATION_KEYS_MAPPED_TO_HEADERS = {
  reference: 'Reference Number',
  // importName: 'Import Name',
  companyEmail: 'Company Email',
  applicationType: 'Application Type',
  vesselName: 'Vessel Name',
  vesselType: 'Vessel Type',
  // capacity: 'Capacity',
  paymentStatus: 'Payment Status',
  status: 'Status',
  createdDate: 'Initiation Date',
};

export const FIELD_OFFICER_NOA_KEYS_MAPPED_TO_HEADERS = {
  reference: 'Reference',
  companyName: 'Company Name',
  companyEmail: 'Company Email',
  vesselName: 'Vessel Name',
  vesselType: 'Vessel Type',
  jetty: 'Jetty',
  // capacity: 'Capacity',
  status: 'Status',
  // rrr: 'RRR',
  createdDate: 'Initiated Date',
};

export const REJECTED_COQ_KEYS_MAPPED_TO_HEADERS = {
  reference: "Reference",
  companyName: "Company Name",
  companyEmail: "Company Email",
  vesselName: "Vessel Name",
  vesselType: "Vessel Type",
  jetty: "Jetty",
  status: "Status",
  createdDate: "Initiated Date",
  submittewdDate: "Submitted Date"
}

export const REJECT_PPCOQ_KEYS_MAPPED_TO_HEADERS = {
  
}

export const COQ_KEYS_MAPPED_TO_HEADERS = {
  companyName: 'Company Name',
  vesselName: 'Vessel Name',
  depotName: 'Depot Name',
  volume: 'Volume (Litres)',
  dateOfArrival: 'Date of Arrival',
  dischargeDate: 'Date of Discharge',
  depotPrice: 'Depot Price',
  submittedDate: 'Date Submitted',
  status: 'Status',
};

export const PP_COQ_KEYS_MAPPED_TO_HEADERS = {
  reference: 'Reference Number',
  plantName: 'Plant Name',
  consignorName: 'Consignor Name',
  consignee: 'Consignee Name',
  shipmentNo: 'Shipment Number',
  startTime: 'Start Time',
  endTime: 'End Time',
  price: 'Price',
  submittedDate: 'Date Submitted',
  status: 'Status',
};

export const DN_KEYS_MAPPED_TO_HEADERS = {
  reference: 'Reference',
  name: 'Name',
  depotName: 'Depot Name',
  depotPrice: 'Depot Price',
  gsv: 'GSV',
  debitNote: 'Debit Note',
};
