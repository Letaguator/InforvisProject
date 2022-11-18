import React, { Component } from 'react'

import * as d3 from "d3";
import './widget.css';
export default class InteractionCountGraph extends Component {
  constructor(props){
   super();
   //read both segmentation and interaction log files
   const file = require('../Data/Dataset_1/UserInteractions/Arms_P1_InteractionsLogs.json');
   const file2 = require('../Data/Dataset_1/Segmentation/SegmentationJson/P1.json');
    this.state = {
      jsonData: file,
      csvData: file2,
      loading: true,
    }
    this.myReference = React.createRef();
  }
  componentDidMount(){
    this.update();
  }
  componentWillMount() {
    this.load();
    console.log(this.props.interactions)
  }
  // processes participant into segmentInteraction data aka ds1_UISegmented
  load(){ 
    var jsonData = this.state.jsonData.map(interaction => {
      interaction.time = interaction.time / 10;
      // interaction.duration /= 10;
      return interaction;
    });
    var csvData = this.state.csvData;
     console.log(csvData)
    var segmentInteractionData = csvData.map((segmentData) => {
      // console.log(segmentData);
      segmentData.interactions = jsonData.filter(interaction => {
        return (interaction.time >= segmentData.start) && (interaction.time < segmentData.end);
      });
      return segmentData;
    });

    // console.log(segmentInteractionData);
    let count = 0;
    segmentInteractionData.forEach(segment => {
      segment.interactions.forEach(interaction => {
        count++;
      })
    });
    this.setState({
      jsonData: jsonData,
      csvData: csvData,
    })
    
};
// d3 stuff goes in here
update(){
  var ds1_UISegmented = this.state.csvData;
  // Creating set of interaction types 
	const interactionTypes = new Set()
	for(let i = 0; i < ds1_UISegmented.length; i++){
		for(let j = 0; j < ds1_UISegmented[i].interactions.length; j++){
			interactionTypes.add(ds1_UISegmented[i].interactions[j].InteractionType)
		}
	}
	let interactionCount = [];

	for (const item of interactionTypes) {
		let obj = {actionName: item,count: 0};
		interactionCount.push(obj);
	}

	for(let i = 0; i < ds1_UISegmented.length; i++){
		for(let j = 0; j < ds1_UISegmented[i].interactions.length; j++){
			let entry = interactionCount.find(item =>item.actionName === ds1_UISegmented[i].interactions[j].InteractionType);
			++entry.count;
		}
	}
  console.log(interactionCount);
	interactionCount = interactionCount.sort((a, b) => b.count - a.count);
    var svg = d3.select(this.myReference.current),
    margin = 100,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - 200



var xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
           .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(interactionCount.map(function(d) { return d.actionName; }));
    yScale.domain([0, d3.max(interactionCount, function(d) { return d.count; })]);

    g.append("g")
     .attr("transform", "translate(0," + (height)+ ")")
     .call(d3.axisBottom(xScale))
     .selectAll("text")
     .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
     .attr("transform", "rotate(-65)")
     

    g.append("g")
     .call(d3.axisLeft(yScale).tickFormat(function(d){
         return  d;
     })
     .ticks(10))
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "-5.1em")
     .attr("text-anchor", "end")
     

    g.selectAll(".bar")
     .data(interactionCount)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return xScale(d.actionName); })
     .attr("y", function(d) { return yScale(d.count); })
     .attr("width", xScale.bandwidth())
     .attr("height", function(d) { return height - yScale(d.count); });


}
  render() {
    return (
      <div className='widget'>
         <span className='title'>{this.props.title}</span>
      <svg ref= {this.myReference} height={400} width={400}></svg>
      </div>
    )
  }
}