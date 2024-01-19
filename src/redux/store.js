import { configureStore } from "@reduxjs/toolkit";
import { fetchPlatformDataSlice } from "./slice/plaftformDataSlice";
import {
  fetchRegisteredVesselSlice,
  saveRegisteredVesselSlice,
} from "./slice/registeredVesselSlice";
import {
  fetchGeneralReportSlice,
  saveGeneralReportSlice,
} from "./slice/generalReportSlice";
import {
  loginSlice,
  registerSlice,
  getAllUsersSlice,
} from "./slice/userAuthSlice";
import { addUploadDataSlice } from "./slice/uploadData";
import { fetchVisReportSlice } from "./slice/visReportSlice";
import {
  fetchRegisteredMerchantVesselSlice,
  saveRegisteredMerchantVesselSlice,
} from "./slice/registeredMerchantVesselSlice";
import {
  fetchIntelReportSlice,
  saveIntelReportSlice,
} from "./slice/intelReportSlice";
import {
  fetchMissionReportSlice,
  saveMissionReportSlice,
} from "./slice/missionReportSlice";
import { addCosposUploadDataSlice } from "./slice/cosposUploadDataSlice";
import { addJmisLostReportUploadDataSlice } from "./slice/jmsiLostReportUploadDataSlice";
import { addPNSCUploadDataSlice } from "./slice/PNSCUploadDataSlice";
import { addSituationUploadDataSlice } from "./slice/situationReportUploadData";
import {
  fetchIntelDetailReportSlice,
  saveIntelDetailReportSlice,
} from "./slice/intelDetailDataSlice";
import {
  fetchShipBreakingnReportSlice,
  saveShipBreakingReportSlice,
} from "./slice/shipbreakingReportSlice";
import { addSitutationalReportDataSlice } from "./slice/addSituationalReport";
import { addLostReportDataSlice } from "./slice/addLostReport";
import { addPnscReportDataSlice } from "./slice/addPnscReport";
import { fetchMerchantVesselDetailsSlice } from "./slice/merchatDetailsDataSlice";
const store = configureStore({
  reducer: {
    fetchPlatformData: fetchPlatformDataSlice.reducer,
    upload: addUploadDataSlice.reducer,
    cospos: addCosposUploadDataSlice.reducer,
    lostreport: addJmisLostReportUploadDataSlice.reducer,
    pnsc: addPNSCUploadDataSlice.reducer,
    situationreport: addSituationUploadDataSlice.reducer,
    fetchVisData: fetchVisReportSlice.reducer,
    // addPlatformData: addPlatformDataSlice.reducer,
    fetchRegisteredVesselData: fetchRegisteredVesselSlice.reducer,
    saveRegisteredVesselData: saveRegisteredVesselSlice.reducer,
    fetchRegisteredMerchantVesselData:
      fetchRegisteredMerchantVesselSlice.reducer,
    saveRegisteredMerchantVesselData: saveRegisteredMerchantVesselSlice.reducer,
    fetchMerchantVesselDetails:fetchMerchantVesselDetailsSlice.reducer,
    // fetchRegistedVesselById: fetchRegistedVesselByIdSlice.reducer,
    fetchGeneralReport: fetchGeneralReportSlice.reducer,
    fetchIntelReport: fetchIntelReportSlice.reducer,
    fetchIntelDetailReport: fetchIntelDetailReportSlice.reducer,
    fetchMissionReport: fetchMissionReportSlice.reducer,
    fetchShipBreakingReport: fetchShipBreakingnReportSlice.reducer,
    // fetchGeneralById: fetchGeneralReportByIdSlice.reducer,
    // fetchMerchantVessel: fetchMerchantVesselSlice.reducer,
    // fetchFishingVessel: fetchFishingVesselSlice.reducer,
    loginAuth: loginSlice.reducer,
    register: registerSlice.reducer,
    saveGeneralReport: saveGeneralReportSlice.reducer,
    saveIntelReport: saveIntelReportSlice.reducer,
    saveIntelDetailReport: saveIntelDetailReportSlice.reducer,
    saveMissionReport: saveMissionReportSlice.reducer,
    saveShipBreakingReport: saveShipBreakingReportSlice.reducer,
    getUsers: getAllUsersSlice.reducer,

    addSituationalReport: addSitutationalReportDataSlice.reducer,
    addLostReport: addLostReportDataSlice.reducer,
    addPnscReport: addPnscReportDataSlice.reducer,
  },
});

export default store;
