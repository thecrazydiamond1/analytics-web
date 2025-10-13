import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as d3 from "d3";

const PltypeBasedStackedBarChart = ({ onSendData = () => {} }) => {
  const [period, setPeriod] = useState("YEAR");
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [weekDate, setWeekDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const svgRef = useRef();
  const tooltipRef = useRef();

const colorMap = React.useMemo(() => ({
    limitedmed: "#4477aa",      // Blue
    medical: "#ee6677",         // Red/Pink
    dental: "#228833",          // Green
    hospital: "#ccbb44",        // Yellow/Gold
    critical: "#aa3377",        // Purple
    lifestyle: "#66ccee",       // Cyan
    term_life: "#ee7733",       // Orange
    supplemental: "#332288",    // Indigo
    vision: "#bb5566",          // Rose
    accident: "#ddaa33",        // Amber
    others: "#999999",          // Gray
}), []);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (period === "MONTH" && (!fromDate || !toDate)) {
        setData([]);
        setErrorMessage("");
        setLoading(false);
        return;
      }
      const requestData = 
      period === "DAY" 
      ? { data: "DAY", date } 
      : period === "MONTH"
      ? {data:"MONTH", from:fromDate, to:toDate}
      : period === "WEEK"
      ? {data: "WEEK", weekDate}
      :{ data: period };
      
      axios.post("http://127.0.0.1:3000/api/enrollments/pltype", requestData)
        .then((res) => {
          setErrorMessage("");
          let responseData = res.data.data;
          if (period === "DAY" && !Array.isArray(responseData)) {
            responseData = [responseData];
          }
          setData(Array.isArray(responseData) ? responseData : []);
          onSendData(responseData); 
        })
        .catch((err) => {
          const serverMsg = err && err.response && err.response.data && err.response.data.message;
          const msg = serverMsg || err.message || "Error fetching data";
          setErrorMessage(msg);
          setData([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [period, date, fromDate, toDate, weekDate]);

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

    // Define x-scale based on period
    let xScale;
    let xKey;
    if (period === "YEAR") {
      xKey = "year";
      xScale = d3.scaleBand()
        .domain(data.map((d) => d.year))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    } else if (period === "MONTH") {
      xKey = "month";
      xScale = d3.scaleBand()
        .domain(data.map((d) => d.month))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    } else if (period === "WEEK") {
      xKey = "day";
      xScale = d3.scaleBand()
        .domain(data.map((d) => d.day))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    } else if (period === "DAY") {
      xKey = "time";
      xScale = d3.scaleBand()
        .domain(data.map((d) => d.time))
        .range([margin.left, width - margin.right])
        .padding(0.2);
    }

    // Prepare data for stacked bar chart
    const keys = Object.keys(colorMap);
    
    // Create stacked data
    const stackGenerator = d3.stack()
      .keys(keys)
      .value((d, key) => +d[key] || 0);
    
    const stackedData = stackGenerator(data);

    // Calculate max Y value for the domain
    const maxY = d3.max(stackedData[stackedData.length - 1], d => d[1]);
    const yScale = d3.scaleLinear()
      .domain([0, maxY])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

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

    // Create the stacked bars
    svg
      .append("g")
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", d => colorMap[d.key])
      .selectAll("rect")
      .data(d => d)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.data[xKey]))
      .attr("y", d => yScale(d[1]))
      .attr("height", d => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .style("opacity", 0)
      .on("mouseover", function(event, d) {
        // Highlight the bar segment
        d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
        
        // Show tooltip
        tooltip.style("opacity", 1).style("display", "block");
        
        const label = period === "YEAR" ? d.data.year : 
                     period === "MONTH" ? d.data.year + d.data.month : 
                     period === "WEEK" ? d.data.day : 
                     d.data.time;
        
        tooltip.html(`
            <div><strong>${label}</strong></div>
            <div style="color:${colorMap.limitedmed}">Limitedmed: ${d.data.limitedmed}</div>
            <div style="color:${colorMap.medical}">Medical: ${d.data.medical}</div>
            <div style="color:${colorMap.dental}">Dental: ${d.data.dental}</div>
            <div style="color:${colorMap.hospital}">Hospital: ${d.data.hospital}</div>
            <div style="color:${colorMap.critical}">Critical: ${d.data.critical}</div>
            <div style="color:${colorMap.lifestyle}">Lifestyle: ${d.data.lifestyle}</div>
            <div style="color:${colorMap.term_life}">Term Life: ${d.data.term_life}</div>
            <div style="color:${colorMap.supplemental}">Supplemental: ${d.data.supplemental}</div>
            <div style="color:${colorMap.vision}">Vision: ${d.data.vision}</div>
            <div style="color:${colorMap.accident}">Accident: ${d.data.accident}</div>
            <div style="color:${colorMap.others}">Others: ${d.data.others}</div>
        `);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 10) + "px");
      })
      .on("mouseout", function() {
        // Remove highlight
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
        
        // Hide tooltip
        tooltip.style("opacity", 0).style("display", "none");
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .style("opacity", 1);


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
        <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a", letterSpacing: "0.2px" }}>Plan Type Based Enrolls</h2>

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
          {period === "MONTH" && (
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginLeft: 4 }}>
              <input
                type="month"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                max={new Date().toISOString().slice(0,7)}
                style={{ padding: '6px 8px', fontSize: '13px', borderRadius: '8px', border: '1px solid #e6e9ee', outline: 'none', background: '#fff' }}
              />
              <span style={{ color: '#9ca3af', fontSize: 12 }}>to</span>
              <input
                type="month"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                max={new Date().toISOString().slice(0,7)}
                style={{ padding: '6px 8px', fontSize: '13px', borderRadius: '8px', border: '1px solid #e6e9ee', outline: 'none', background: '#fff' }}
              />
            </div>
          )}
          {period === "WEEK" && (
            <input
              type="date"
              value={weekDate}
              onChange={(e) => setWeekDate(e.target.value)}
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
        {!loading && errorMessage && (
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 5,
            pointerEvents: "none",
            color: "#6b7280",
            fontSize: 14
          }}>
            {errorMessage}
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

        {/* HTML legend below the chart */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "center", paddingTop: 12, maxWidth: "100%" }}>
          {Object.entries(colorMap).map(([key, color]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 6, background: color, display: "inline-block", boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }} />
              <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{key.replace(/_/g, " ")}</span>
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

export default PltypeBasedStackedBarChart;