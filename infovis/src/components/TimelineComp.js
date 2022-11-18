import React, {useState,useEffect} from 'react';
import './timelinecomp.css';
import TimelineChart from './TimelineChart';
import * as d3 from 'd3';
import { useD3 } from '../hooks/useD3';
import * as main from '../Scripts/main.js';


export default class TimelineComp extends React.Component {
    constructor(props) {
        super(props);
        this.myReference = React.createRef();
      }

      render(){
        return (

            <div className='widget'>
              <div className='left'>
                <div >
                        <h2 className='title'>Segementations Timeline</h2>
                    </div>
              </div>
            </div>
          )
      }
       
}
// export const TimelineComp = () => {
   
    
//   return (

//     <div className='widget'>
//       <div className='left'>
//         <div >
// 				<h2 className='title'>Segementations Timeline</h2>
//                 <div ref={this.myReference}>
//                      </div>
// 			</div>
//       </div>
//     </div>
//   )
// }

// const [data,setData] = useState(null);
//     async function loadData(){
//         let ds1_UISegmented = await main.readDataAsync(main.FILEPATHS[0][0], main.FILEPATHS[0][1]);
// 	    console.log("Timeline arr data: ", ds1_UISegmented );
//         ds1_UISegmented.reverse();
//         setData(ds1_UISegmented);
//         console.log(data);
//     }

// const ref = useD3(() =>{
    //     const margin = {top: 20, right: 30, bottom: 40, left: 90},
    //     width = 5000 - margin.left - margin.right,
    //     // height = 500 - margin.top - margin.bottom;
    //     height = 100;
    
    // const div = d3.select(this.refs.timelineDiv).append("div")	
    //     .attr("class", "tooltip")				
    //     .style("opacity", 0);

    //     const svg = d3.select("#timelineDiv")
    //   .append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height+ 100 + margin.top + margin.bottom)
    //   .append("g")
    //     .attr("transform", `translate(${margin.left}, ${margin.top})`);
    //     const x = d3.scaleLinear()
    //             .domain([0, 5500])
    //             .range([ 0, width]);

    //             svg.append("g")
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(d3.axisBottom(x))
    //     // .tickValues(parsedData)
    //     // .tickFormat(function(d) {
    //     // return d3.timeFormat(specifier)(d)
    //     // })
    //     .selectAll("text")
    //     .style("text-anchor", "end");
    // svg.append("text")
    //     .attr("class", "x label")
    //     .attr("text-anchor", "middle")
    //     .attr("transform", "translate(" + (margin.left-40) + ", " + (height + (margin.bottom / 2.0)+20) + ")")
    //     // .attr("x", width)
    //     // .attr("y", height - 6)
    //     .text("time (in seconds)");  
    // // Y axis
    // const y = d3.scaleBand()
    //             .range([ 0, height ])
    //             .domain(data.map(d => d.ID))
    //             .padding(.3);
    // svg.append("g")
    //     .call(d3.axisLeft(y).tickValues([]))
    //     .call(g => g.select(".domain").remove())
    // // svg.append("text")
    // //     .attr("class", "y label")
    // //     .attr("text-anchor", "middle")
    // //     .attr("y", 6)
    // //     .attr("transform", "translate(" + (margin.left - 120) + ", " + (height / 2.0) + ") rotate(-90)")
    // //     .text("Interactions");
    // let zoom = d3.zoom()
    // .on('zoom', handleZoom);

    // function handleZoom(e) {
    // d3.select('svg g')
    //     .attr('transform', e.transform);
    // }

    // function initZoom() {
    // d3.select('svg')
    //     .call(zoom);
    // }
    // var colour = d3.scaleOrdinal(['#FF355E','#AAF0D1']);

    // //Timeline rectangles
    // svg.selectAll("myRect")
    //     .data(data)
    //     .join("rect")
    //     .attr("x", d => x(d['start']))
    //     // .attr("y", d => y(d.ID))
    //     .attr("width", d => x(d['length (sec)']))
    //     .attr("height", "100")
    //     // .attr("height", height)
    //     .attr("stroke", "black")
    //     .attr("stroke-width", "1")
    //     // .attr("fill", "lime")
    //     // .style("background-color", function(d, i) {
    //     //     return color(i);
    //     //   })
    //     .attr("fill", function(d,i) {
    //         return colour(i);
    //     })
        
    //     .on('mouseover', function (d, i) {
    //         // console.log("id",i);
    //         // // alert(d.ID,d.start,d.end)
    //         // div.transition()		
    //         // .duration(200)		
    //         // .style("opacity", 1);		
    //         // div	.html(i.ID + "<br/>"  + i.start+ "<br/>"+i.end)
    //         // // .position("relative")
    //         // .style("left", (i.start+40) + "px")		
    //         // .style("top", (i.ID) + "px");
    //         // d3.select(this).transition()
    //         //      .duration('50')
    //         //      .attr('opacity', '.6')
    //         div.transition()		
    //         .duration(200)		
    //         .style("opacity", 1);		
    //         div	.html(
    //             `
    //             <ul>
    //             <li>Interaction ID: ${i.ID}</li>
    //             <li>Start Time: ${i.start} sec</li>
    //             <li>End Time: ${i.end} sec</li>
    //             <li>Interaction Time: ${i['length (sec)']} sec</li>
    //             </ul>

    //             `)
    //         .style("left", (d.pageX) + "px")		
    //         .style("top", (d.pageY) + "px");	
    //         // console.log(d.pageX,d.pageY);
    //             })
    //     .on('mouseout', function (d, i) {
    //         div.transition()		
    //             .duration(500)		
    //             .style("opacity", 0);
    //             // d3.select(this).transition()
    //             // .duration('50')
    //             // .attr('opacity', '1')
    //         })
    //     .on('click', function (d, i) {
    //             d3.select(this).transition()
    //             .duration('50')
    //             .attr('opacity', '1')})
    //     initZoom()
    // });