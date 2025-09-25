import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const AgentsPieChart = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [counts, setCounts] = useState({ loggedin: 0, nonloggedin: 0 });
  const [agentsData, setAgentsData] = useState({ loggedin_agents: [], nonLoggedin_agents: [] });
  const [selectedAgentList, setSelectedAgentList] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:3000/api/un-log/agents')
      .then(response => {
        const data = response.data;
        setCounts({
          loggedin: data.loggedin_counts || 0,
          nonloggedin: data.nonLoggedin_counts || 0,
        });
        setAgentsData({
          loggedin_agents: data.loggedin_agents || [],
          nonLoggedin_agents: data.nonLoggedin_agents || [],
        });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const { loggedin, nonloggedin } = counts;
    if (loggedin === 0 && nonloggedin === 0) return;

    const data = [
      { label: 'Logged In', value: loggedin },
      { label: 'Non Logged In', value: nonloggedin },
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
      .range(['#1f77b4', '#ff7f0e']);

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
      let agentsForSlice = [];
      if (label === 'Logged In') {
        agentsForSlice = agentsData.loggedin_agents.map(agent => agent.agent_id.toString());
      } else if (label === 'Non Logged In') {
        agentsForSlice = agentsData.nonLoggedin_agents.map(agent => agent.agent_id.toString());
      }
      setSelectedAgentList(agentsForSlice);
      setSearchTerm('');
    });

  }, [counts, agentsData]);

  const filteredAgents = selectedAgentList
    ? selectedAgentList.filter(agentId => agentId.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <>
      <div style={{ display: 'inline-block', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Agent Login Status</div>
        <svg ref={svgRef} />
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
      </div>

      {selectedAgentList && (
        <div style={{
          position: 'fixed',
          top: '100px',
          left: '30%',
          transform: 'translateX(-50%)',
          backgroundColor: 'white',
          color: '#333',
          padding: '10px',
          borderRadius: '6px',
          maxHeight: '300px',
          maxWidth: '400px',
          overflowY: 'auto',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}>
          <input
            type="text"
            placeholder="Search agent ID"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                marginBottom: '12px',
                fontSize: '1rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={e => e.target.style.borderColor = '#007BFF'}
              onBlur={e => e.target.style.borderColor = '#ccc'}
          />
          <button onClick={() => setSelectedAgentList(null)} style={{ marginTop: '10px' }}>❌</button>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {filteredAgents.length === 0
              ? <li style={{ padding: '8px', color: '#666' }}>No agents found</li>
              : filteredAgents.map(agentId => (
                <li key={agentId} style={{ padding: '4px 0' }}>{agentId}</li>
              ))
            }
          </ul>
        </div>
      )}
    </>
  );
};

export default AgentsPieChart;
