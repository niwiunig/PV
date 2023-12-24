import React, { useState, useEffect } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";
import { ResponsiveLine } from "@nivo/line";
import axios from "axios";
import moment from "moment/moment";

//const token =  "YOUR-TOKEN";

const influxDbUrl = 'http://pixelbay.at:8086/query';
const databaseName = 'influx';
const username = 'admin';
const password = 'admin';
const query = `SELECT MEAN("value") AS mean_value
FROM "opendtu"
WHERE time >= '${moment().startOf('day').toISOString()}' AND time < '${moment().endOf('day').toISOString()}'
AND topic = 'opendtu/ac/power'
GROUP BY time(5m)`;

export const TodaysPowerChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(influxDbUrl, {
      params: {
        db: databaseName,
        u: username,
        p: password,
        q: query,
      }
    })
      .then((res) => {
        let acPower = res.data.results[0].series[0].values
        acPower = acPower.map(t => {
          return { x: new Date(t[0]).toLocaleTimeString(), y: parseFloat(t[1] ?? 0).toFixed(0) }
        })
        console.log(acPower)
        setData(acPower)

      })
  }, [])


  return (
    <div style={{ height: '400px' }}>
      <h1 style={{ marginBottom: "0px", paddingBottom: "0px" }}>Heutige Leistung</h1>
      <ResponsiveLine
        data={[{ id: 'example', data }]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        //xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Uhrzeit',
          legendOffset: 36,
          legendPosition: 'middle',
          tickValues: []
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Leistung',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={1}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </div>
  )
};