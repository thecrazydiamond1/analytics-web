import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";

const TierBasedLineChart = () => {
  const [period, setPeriod] = useState("YEAR");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef();
  const tooltipRef = useRef();

  const colorMap = React.useMemo(() => ({
    IO_tier: "#3498db",
    IF_tier: "#e74c3c",
    IS_tier: "#2ecc71",
    IC_tier: "#f39c12",
  }), []);

  const debounceRef = useRef(null);


  useEffect(() => {

    setLoading(true);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const requestData = period === "DAY" ? { data: "DAY", date } : { data: period };
      
      axios.post("http://127.0.0.1:3000/api/enrollments/tier", requestData)
        .then((res) => {
          let responseData = res.data.data;
          if (period === "DAY" && !Array.isArray(responseData)) {
            responseData = [responseData];
          }
          setData(Array.isArray(responseData) ? responseData : []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setData([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [period, date]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const tooltip = d3.select(tooltipRef.current);

    // If there's no data, clear any previous drawing and exit early
    if (!data || data.length === 0) {
      svg.selectAll("*").remove();
      // hide tooltip if visible
      if (tooltip) {
        tooltip.style("opacity", 0).style("display", "none");
      }
      return;
    }

    svg.selectAll("*").remove();
    const width = 600;
    const height = 350;
    const margin = { top: 40, right: 120, bottom: 70, left: 70 }; 

    svg.attr("width", width).attr("height", height);

    let xScale;
    if (period === "YEAR") {
      xScale = d3.scaleBand().domain(data.map((d) => d.year)).range([margin.left, width - margin.right]).padding(0.2);
    } else if (period === "MONTH") {
      xScale = d3.scaleBand().domain(data.map((d) => d.month)).range([margin.left, width - margin.right]).padding(0.2);
    } else if (period === "WEEK") {
      xScale = d3.scaleBand().domain(data.map((d) => d.day)).range([margin.left, width - margin.right]).padding(0.2);
    } else if (period === "DAY") {
      xScale = d3.scaleBand().domain(data.map((d)=>d.time)).range([margin.left, width - margin.right]).padding(0.2);
    }

    const maxY = d3.max(data, (d) =>
      Math.max(+d.IO_tier, +d.IF_tier, +d.IS_tier, +d.IC_tier)
    );
    const yScale = d3.scaleLinear().domain([0, maxY]).nice().range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = period === "DAY" || period === "WEEK" ? d3.axisLeft(yScale).ticks(maxY).tickFormat(d3.format("d")) : d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "12px");


    const xKey = period === "DAY" ? "time" : period === "YEAR" ? "year" : period === "MONTH" ? "month" : "day";

    const getXPos = (d) => {
      if (!d) return null;
      const v = d[xKey];
      if (v == null) return null;
      const mapped = xScale(v);
      if (mapped == null || Number.isNaN(mapped)) return null;
      const bw = typeof xScale.bandwidth === "function" ? xScale.bandwidth() / 2 : 0;
      return mapped + bw;
    };

    const lineGen = (key) =>
      d3
        .line()
        .x((d) => getXPos(d))
        .y((d) => yScale(+d[key]))
        .curve(d3.curveMonotoneX);

    Object.entries(colorMap).forEach(([key, color]) => {
      const filtered = data.filter((d) => {
        const x = getXPos(d);
        const y = +d[key];
        return x != null && !Number.isNaN(y);
      });

      const path = svg.append("path").datum(filtered)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", lineGen(key));

      const totalLength = path.node().getTotalLength();

      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1500)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
    });

    const visiblePoints = data.filter((d) => getXPos(d) != null);
    visiblePoints.forEach((d) => {
      const xPos = getXPos(d);
      Object.entries(colorMap).forEach(([key, color]) => {
        const yPos = yScale(+d[key]);
        if (yPos == null || Number.isNaN(yPos)) return;
        const dot = svg.append("circle")
          .attr("cx", xPos)
          .attr("cy", yPos)
          .attr("r", 4)
          .attr("fill", color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
          .style("opacity", 0)
          .style("cursor", "pointer");

        dot.transition().delay(1500).duration(300).style("opacity", 1);

        dot.on("mouseover", () => {
          tooltip.style("opacity", 1).style("display", "block");

          const label = period === "YEAR" ? d.year : period === "MONTH" ? d.month : period === "WEEK" ? d.day : d.time;

          tooltip.html(`
            <div><strong>${label}</strong></div>
            <div style="color:${colorMap.IO_tier}">IO: ${d.IO_tier}</div>
            <div style="color:${colorMap.IF_tier}">IF: ${d.IF_tier}</div>
            <div style="color:${colorMap.IS_tier}">IS: ${d.IS_tier}</div>
            <div style="color:${colorMap.IC_tier}">IC: ${d.IC_tier}</div>
          `);
        })
        .on("mousemove", (event) => {
          tooltip.style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0).style("display", "none");
        });
      });
    });

  }, [data, period, colorMap]);

  return (
    <div style={{ 
      fontFamily: "Inter, 'Segoe UI', Tahoma, Geneva, Verdana, system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial",
      padding: "14px",
      maxWidth: "860px",
      margin: "0 auto",
      color: "#111827"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
  <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a", letterSpacing: "0.2px" }}>Tier Based Enrolls</h2>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            id="period-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            style={{
              padding: "6px 10px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #e6e9ee",
              outline: "none",
              cursor: "pointer",
              background: "linear-gradient(180deg,#fff,#fbfdff)",
              boxShadow: "inset 0 -1px 0 rgba(16,24,40,0.02)"
            }}
          >
            <option value="YEAR">Year</option>
            <option value="MONTH">Month</option>
            <option value="WEEK">Week</option>
            <option value="DAY">Day</option>
          </select>

          {period === "DAY" && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              style={{
                padding: "6px 8px",
                fontSize: "13px",
                borderRadius: "8px",
                border: "1px solid #e6e9ee",
                outline: "none",
                cursor: "pointer",
                marginLeft: 6,
                background: "#fff"
              }}
            />
          )}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {loading && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            background: "rgba(255,255,255,0.96)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#374151",
            boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
            fontWeight: 600
          }}>
            Loading data...
          </div>
        )}
        
        {/* placeholder when there's no data */}
        {!loading && (!data || data.length === 0) && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            pointerEvents: "none",
            color: "#6b7280",
            fontSize: 14
          }}>
            No data available for the selected period
          </div>
        )}

        <svg
          ref={svgRef}
          style={{
            width: "100%",
            height: "360px",
            backgroundColor: "#fff",
            boxShadow: "0 6px 20px rgba(2,6,23,0.06)",
            borderRadius: "12px",
          }}
        />

        {/* HTML legend below the chart to avoid overlap with the lines */}
        <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center", paddingTop: 12 }}>
          {Object.entries(colorMap).map(([key, color]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: color, display: "inline-block", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }} />
              <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{key.replace(/_/g, " ")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          background: "#0f172a",
          color: "#fff",
          padding: "8px 10px",
          borderRadius: "8px",
          fontSize: "12px",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.16s",
          zIndex: 1000,
          display: "none",
          boxShadow: "0 8px 26px rgba(2,6,23,0.12)",
          minWidth: 120
        }}
      />
    </div>
  );
};

export default TierBasedLineChart;