import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ReinstatedTable from './reinstatedTable';
import apiClient from '../../services/apiclient';

const ReinstatedPieChart = ({ onSendData = () => {}, onImgData=()=>{} }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [counts, setCounts] = useState({ total_reinstated: 0, others: 0 });
  const [policyData, setPolicyData] = useState({ reinstated: [], other: [] });
  const [showTable, setShowTable] = useState(false);
  const chartContainerRef = useRef();

  useEffect(() => {
    apiClient.get('/reinstated')
      .then(response => {
        const data = response.data;
        onSendData(data);
        setCounts({
          total_reinstated: data.total_reinstated || 0,
          others: data.others[0].count || 0,
        });
        setPolicyData({
          reinstated: data.reinstated || [],
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const { total_reinstated, others } = counts;
    if (total_reinstated === 0 && others === 0) return;

    const data = [
      { label: 'Reinstated', value: total_reinstated },
      { label: 'Others', value: others },
    ];

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height);

    const chart = svg
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#636363', '#b2df8a']);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arcs = pie(data);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius - 10);

    const arcsGroup = chart.selectAll('g.slice')
      .data(arcs)
      .join('g')
      .attr('class', 'slice');

    arcsGroup.append('path')
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .each(function () { this._current = { startAngle: 0, endAngle: 0 }; })
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(1);
        return t => arc(interpolate(t));
      });

    const tooltip = d3.select(tooltipRef.current);

    arcsGroup.on('mouseenter', function(event, d) {
      const svgRect = svgRef.current.getBoundingClientRect();
      // Calculate position relative to svg container
      const x = event.clientX - svgRect.left;
      const y = event.clientY - svgRect.top;

      tooltip
        .style('opacity', 1)
        .html(`<strong>${d.data.label}:</strong> ${d.data.value}`)
        .style('left', (x + 10) + 'px')
        .style('top', (y + 10) + 'px');

      d3.select(this)
        .transition()
        .duration(300)
        .attr('transform', `translate(${arc.centroid(d)[0] * 0.1},${arc.centroid(d)[1] * 0.1}) scale(1.05)`);
    }).on('mouseleave', function () {
      tooltip.style('opacity', 0);
      d3.select(this)
        .transition()
        .duration(300)
        .attr('transform', 'translate(0,0) scale(1)');
    });

    arcsGroup.on('click', (event, d) => {
      const label = d.data.label;
      if(label === 'Reinstated' ){
        setShowTable(true);
      } else if(label === 'Others'){
        setShowTable(false);
      }   
    });

  }, [counts, policyData]);

  useEffect(() => {
    if (!counts || counts.length === 0) return;
    const Element = chartContainerRef.current;
    onImgData(Element); 
  }, [counts]);

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxHeight: '80vh',
    overflowY: 'auto',
    maxWidth: '90vw',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    position: 'relative',
  };

  return (
    <>
      <div style={{ display: 'inline-block', textAlign: 'center', position: 'relative'}}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Reinstated Policy Status</div>
          <div ref={chartContainerRef} style={{ position: "relative" }}>
            <svg ref={svgRef} />
          </div>
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '14px',
          }}
        />
        {showTable && (
          <div style={overlayStyle} onClick={() => setShowTable(false)}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowTable(false)} style={{ position: 'absolute', top: 10, right: 10 }}>Close</button>
              <ReinstatedTable data={policyData.reinstated} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReinstatedPieChart;
