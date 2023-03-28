import { useEffect } from "react";
import ChartsEmbedSDK from "@mongodb-js/charts-embed-dom";
import { Paper, Stack} from "@mui/material";

const FinancialStatistic = () => {
  const sdk = new ChartsEmbedSDK({
    baseUrl: "https://charts.mongodb.com/charts-fyp-scujj",
    showAttribution: false,
  });
  const salesChart = sdk.createChart({
    chartId: "64231cd3-90fe-4de0-8b0a-cbecf43ecc7d",
  });

  const salesChartOnServices = sdk.createChart({
    chartId: "64231932-5c66-4dd9-88b7-9680a5adc7bb",
  });

  useEffect(() => {
    salesChart.render(document.getElementById("chart-data"));

    salesChartOnServices.render(document.getElementById("chart-services-data"));
  }, []);

  return (
    <Stack direction="row" gap={5}>
      <Paper sx={{width:500}}>
        <div id="chart-data" style={{ height: 700}}></div>
      </Paper>
      <Paper sx={{width:1200}}>
        <div id="chart-services-data" style={{ height: 700 }}></div>
      </Paper>
    </Stack>
  );
};

export default FinancialStatistic;
