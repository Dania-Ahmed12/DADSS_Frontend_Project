import { React, useState } from "react";
import FilledButton from "../../src/components/button/FilledButton";
import { Col, Row } from "antd";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { saveIntelDetailReport } from "../../src/redux/thunks/intelDetailData";
import PageHeader from "../../src/components/pageheader/pageHeader";

const MacroDataTable = dynamic(
  () => import("../../src/components/table/MacroDataTable"),
  {
    ssr: false,
    loading: () => (
      <LoadingOutlined style={{ color: "#012169", fontSize: "40px" }} />
    ),
  }
);

const JettyDataTable = dynamic(
  () => import("../../src/components/table/JettyDataTable"),
  {
    ssr: false,
  }
);
function Addintelinput() {
  const router = useRouter();
  const dispatch = useDispatch();
  const IntelDetailReportState = useSelector(
    (state) => state.saveIntelDetailReport
  );

  const init_macro_data = { ir_pf_id: Cookies.get("u_pf_id") };
  const [intelMacroData, setIntelMacroData] = useState(init_macro_data);
  const [macroDataEntered, setMacroDataEntered] = useState(false);
  const [jettyData, setJettyData] = useState([]);

  const handleSendIntelReport = async () => {
    try {
      // Send a POST request to the Intel report endpoint with the provided data
      const macroResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_MSA_BACKEND_API}/ireport`,
        intelMacroData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Check if the response status is either 200 or 201
      if (macroResponse.status === 200 || macroResponse.status === 201) {
        // Extract the generated macro key from the response data
        const macroKey = macroResponse.data.ir_key;

        // If there is Jetty data, iterate through each item and dispatch an action to save Intel detail report
        if (jettyData.length) {
          jettyData.map((item) =>
            dispatch(
              saveIntelDetailReport({
                ...item,
                //The toISOString() method is then called on the dtg object to convert it into a string in the ISO 8601 format.
                ird_detected_from: item.ird_detected_from.toISOString(),
                ird_detected_to: item.ird_detected_to.toISOString(),
                // Add a new property ird_ir_key with the value of macroKey to each item
                ird_ir_key: macroKey,
              })
            )
          );
        }
        // Redirect to the Intel report page after successful data save
        router.push("/intelreport");

        toast.success(`Data Save Successfully`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error(`Upload failed. Please try again. byee`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error(`Upload failed. Please try again. hi`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <PageHeader showButton={false} showSearchBox={false} title="ADD Report" />
      <Row>
        <Col span={23} className="flex items-center justify-end mb-8">
          <FilledButton
            text="Save Report"
            loading={IntelDetailReportState.isLoading}
            disabled={!macroDataEntered}
            onClick={handleSendIntelReport}
            className="rounded-full border-lightgreen bg-lightgreen text-white"
            htmlType="submit"
          />
        </Col>
      </Row>
      {/*-----------------------------------Marco data  (First Table)-------------------------------------*/}
      <MacroDataTable
        intelMacroData={intelMacroData}
        setIntelMacroData={setIntelMacroData}
        init_macro_data={init_macro_data}
        showButtons={true}
        intelMacroDataState={{
          macroDataEntered: macroDataEntered,
          setMacroDataEntered: setMacroDataEntered,
        }}
      />
      {/*-----------------------------------Jeety data  (Second Table)-------------------------------------*/}
      <JettyDataTable jettyData={jettyData} setJettyData={setJettyData} />
    </>
  );
}

export default Addintelinput;
