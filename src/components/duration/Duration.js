import { getDuration } from "../../services/mockServices";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";

function Duration() {
  const [durationData, setDurationData] = useState(null);
  const { id } = useParams();
  let data = [];

  useEffect(() => {
    let mounted = true;
    getDuration().then((items) => {
      if (mounted) {
        let datas = items.find((item) => item.userId === parseFloat(id));
        setDurationData(datas);
      }
    });
    return () => (mounted = false);
  }, [id]);

  if (durationData) {
    durationData.sessions.map((activity) =>
      data.push({
        jour: activity.day,
        durée: activity.sessionLength,
      })
    );
  }

  function weekDays(num) {
    const week = ["L", "M", "M", "J", "V", "S", "D"];
    return week[+num - 1];
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: "white", padding: "5px" }}
        >
          <p className="label">{`${payload[0].value} min`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer height={250} width="30%" className="duration">
      <LineChart
        data={data}
        height="60%"
        width="100%"
        margin={{
          top: 25,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <Tooltip
          animationEasing="ease-out"
          cursor={false}
          content={CustomTooltip}
        />
        <XAxis
          dataKey="jour"
          tick={{ fill: "white", opacity: ".8" }}
          tickFormatter={weekDays}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          padding={{ top: 0, bottom: 0 }}
          type="number"
          domain={["dataMin -10", "dataMax +10"]}
          allowDataOverflow={true}
          tickLine={false}
          axisLine={false}
          tickMargin={0}
          hide
        />

        <Legend
          verticalAlign="top"
          align="left"
          iconSize={0}
          content={() => (
            <div
              className="legend_text"
              style={{
                color: "white",
                marginTop: "-10px",
                marginLeft: "20px",
                opacity: ".5",
                position: "absolute",
                top: "0",
              }}
            >
              Durée moyenne des
              <br />
              sessions
            </div>
          )}
        ></Legend>
        <Line
          dataKey="durée"
          type="natural"
          scale="band"
          stroke="white"
          strokeWidth={2}
          dot={false}
          activeDot={{
            fill: "white",
            strokeOpacity: ".5",
            strokeWidth: "10",
            r: 4,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default Duration;
