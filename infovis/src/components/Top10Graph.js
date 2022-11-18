import React, { Component } from 'react'

import * as d3 from "d3";
import './widget.css';
export default class Top10Graph extends Component {
  constructor(props){
  
    super();
  
   const file = require('../Data/Dataset_1/UserInteractions/Arms_P1_InteractionsLogs.json');
   const file2 = require('../Data/Dataset_1/Segmentation/SegmentationJson/P1.json');
    this.state = {
      path: 'Arms_P1_20_4_6_Prov_Segments.csv',
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
  }
  
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

update(){
  var ds1_UISegmented = this.state.csvData;
  // Creating a set for documents opened
	const documentOpens = new Set()
	for(let i = 0; i < ds1_UISegmented.length; i++){
		for(let j = 0; j < ds1_UISegmented[i].interactions.length; j++){
			if(ds1_UISegmented[i].interactions[j].InteractionType === "Doc_open"){
				documentOpens.add(ds1_UISegmented[i].interactions[j]);
			}
		}
	}

	let documentOpen = new Map();
	for (const item of documentOpens) {
		if(documentOpen.has(item.Text)){
			let duration = documentOpen.get(item.Text);
			documentOpen.set(item.Text, item.duration + duration);
		}else{
			documentOpen.set(item.Text,item.duration);
		}
	}

	const sortedDocuments = new Map([...documentOpen.entries()].sort((a, b) => b[1] - a[1]));
	const sortedDocKeys = Array.from(sortedDocuments.keys());
	const sortedDocVals = Array.from(sortedDocuments.values());
	let top10Documents  = [];

	for (let i = 0; i < 10; i++) {
		let obj = {documentName: sortedDocKeys[i], duration: sortedDocVals[i]/10};
		top10Documents.push(obj);
	}
    console.log(top10Documents);
    var svg = d3.select(this.myReference.current),
    margin = 100,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - 200



var xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
           .attr("transform", "translate(" + 100 + "," + 100 + ")");

    xScale.domain(top10Documents.map(function(d) { return d.documentName; }));
    yScale.domain([0, d3.max(top10Documents, function(d) { return d.duration; })]);

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
     .data(top10Documents)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return xScale(d.documentName); })
     .attr("y", function(d) { return yScale(d.duration); })
     .attr("width", xScale.bandwidth())
     .attr("height", function(d) { return height - yScale(d.duration); });


}
  render() {
    return (
      <div className='widget'>
        <span className='title'>Ten Longest Visted Documents</span>
      <svg ref= {this.myReference} height={400} width={400}></svg>
      </div>
    )
  }
}