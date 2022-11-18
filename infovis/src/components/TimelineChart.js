
import * as d3 from "d3";

import React, { Component } from 'react'
import { paperClasses } from "@mui/material";
import { tickStep } from "d3";


// https://www.pluralsight.com/guides/basic-d3-and-react.js-integration TUTORIAL FOR D3 and react integration
export default class TimelineChart extends Component {
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
    // console.log("THIS",this.csvData);
    
};

update(){
  var ds1_UISegmented = this.state.csvData;
  ds1_UISegmented.reverse();
  // set the dimensions and margins of the graph
  const margin = {top: 20, right: 30, bottom: 40, left: 90},
      width = 2000 - margin.left - margin.right,
      // height = 500 - margin.top - margin.bottom;
      height = 100;
  
  var div = d3.select(this.myReference.current).append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0);

  // append the svg object to the body of the page
  const svg = d3.select(this.myReference.current)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height+ 100 + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
 
  const x = d3.scaleLinear()
              .domain([0, 5500])
              .range([ 0, width]);
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end");
  svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (margin.left-40) + ", " + (height + (margin.bottom / 2.0)+20) + ")")
      .text("time (in seconds)");  
  // Y axis
  const y = d3.scaleBand()
              .range([ 0, height ])
              .domain(ds1_UISegmented.map(d => d.ID))
              .padding(.3);
  svg.append("g")
      .call(d3.axisLeft(y).tickValues([]))
      .call(g => g.select(".domain").remove())
  let zoom = d3.zoom()
  .on('zoom', handleZoom);

  function handleZoom(e) {
    d3.select('svg g')
        .attr('transform', e.transform);
    }
  
    function initZoom() {
    d3.select('svg')
        .call(zoom);
    }
  
  var colour = d3.scaleOrdinal(['#FF355E','#AAF0D1']);

  //Timeline rectangles
  svg.selectAll("myRect")
      .data(ds1_UISegmented)
      .join("rect")
      .attr("x", d => x(d['start']))
      // .attr("y", d => y(d.ID))
      .attr("width", d => x(d['length (sec)']))
      .attr("height", "100")
      // .attr("height", height)
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      // .attr("fill", "lime")
      // .style("background-color", function(d, i) {
      //     return color(i);
      //   })
      .attr("fill", function(d,i) {
          return colour(i);
      })
      
      .on('mouseover', function (d, i) {
          div.transition()		
          .duration(200)		
          .style("opacity", 1);		
          div	.html(
              `
              <ul>
              <li>Interaction ID: ${i.ID}</li>
              <li>Start Time: ${i.start} sec</li>
              <li>End Time: ${i.end} sec</li>
              <li>Interaction Time: ${i['length (sec)']} sec</li>
              </ul>

              `)
          .style("left", (d.pageX) + "px")		
          .style("top", (d.pageY) + "px");	
          // console.log(d.pageX,d.pageY);
              })
      .on('mouseout', function (d, i) {
          div.transition()		
              .duration(500)		
              .style("opacity", 0);
              // d3.select(this).transition()
              // .duration('50')
              // .attr('opacity', '1')
          })
      .on('click', function (d, i) {
              d3.select(this).transition()
              .duration('50')
              .attr('opacity', '1')})
      initZoom()
}
  render() {
    return (
      <div ref={this.myReference} ></div>
    )
  }
}


// function TimelineChart() {
//   const [data,setData ] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [file, setFile] = useState();

//   const fileReader = new FileReader();
//   setFile("Arms_P1_20_4_6_Prov_Segments.csv");
//   React.useEffect(() => {
//     if (file) {
//       fileReader.onload = function (event) {
//           const csvOutput = event.target.result;
//           console.log(csvOutput);
//       };

//       fileReader.readAsText(file);
//       setLoading(false);
//   };
//   }, []);
  
//   return (
//     <div>TimelineChart</div>
//   )
// }

// export default TimelineChart