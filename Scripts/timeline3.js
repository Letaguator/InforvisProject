(async function() {
	// Data preperation
	let ds1_UISegmented = await readDataAsync(FILEPATHS[0][0], FILEPATHS[0][1]);
	console.log("Timeline arr data: ", ds1_UISegmented);
	ds1_UISegmented.reverse();
	// set the dimensions and margins of the graph
	const margin = {
			top: 20,
			right: 30,
			bottom: 40,
			left: 90
		},
		width = 5000 - margin.left - margin.right,
		// height = 500 - margin.top - margin.bottom;
		height = 100;

	var div = d3.select("#timelineDiv").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	var prevElem, prevColour;

    const handleSegmentClick = (i) => {
        const interactionTypes = new Set()
        for (let j = 0; j < i.interactions.length; j++){
            interactionTypes.add(i.interactions[j].InteractionType)
        }
        interactionTypes.delete("Think_aloud");
	    console.log("Interaction Types @ time segment: ", interactionTypes);
        let interactionCount = [];

        for (const item of interactionTypes) {
            let obj = {actionName: item,count: 0};
            interactionCount.push(obj);
        }
        for(let j = 0; j < i.interactions.length; j++){
            if(i.interactions[j].InteractionType != "Think_aloud"){
                let entry = interactionCount.find(item =>item.actionName === i.interactions[j].InteractionType);
                ++entry.count;
            }
        }
        var segmentChartsDiv = document.getElementById("timelineDivSegmentContent");
        while (segmentChartsDiv.lastElementChild) {
            segmentChartsDiv.removeChild(segmentChartsDiv.lastElementChild);
        }
        segmentChartsDiv.innerHTML = `
            <h2>Segementation Content</h2>
        `;
        segmentChartsDiv.style.display = "block";
        segmentChartsDiv.style.width = 600;
        segmentChartsDiv.style.height = 600;

        interactionCount = interactionCount.sort((a, b) => b.count - a.count);
        barChart = BarChart(
            interactionCount,
            {
                x: (d) => d.actionName,
                y: (d) => d.count,
                yLabel: "Count",
                yDomain: [0, 20],
                width: 500,
                height: 500,
                xPadding: 0.3,
                color: "cyan"
            })

        segmentChartsDiv.append(barChart);   

        const documentOpens = new Set()
        for(let j = 0; j < i.interactions.length; j++){
            if(i.interactions[j].InteractionType === "Doc_open"){
                documentOpens.add(i.interactions[j]);
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
        console.log("Sorted Docs @ segment",sortedDocuments);
        console.log("Sorted Docs - Size @ segment",sortedDocuments.size);
        let top10Documents  = [];
        for (let i = 0; i < sortedDocuments.size; i++) {
            let obj = {documentName: sortedDocKeys[i], duration: sortedDocVals[i]/10};
            top10Documents.push(obj);
        }
        // var docVisitsBarchartDiv = document.getElementById("docVisitsBarchartDiv");
		// docVisitsBarchartDiv.style.width = 600;
		// docVisitsBarchartDiv.style.height = 600;
		docVisitsBarChart = BarChart(
			top10Documents,
			{
				x: (d) => d.documentName,
				y: (d) => d.duration,
				yLabel: "Seconds",
				yDomain: [0, 1600],
				width: 500,
				height: 500,
				xPadding: 0.3,
				color: "tomato"
			})
		
        segmentChartsDiv.append(docVisitsBarChart);
        // let ele = document.getElementById('timelineDivSegmentContent');
        
        // ele.style.background = "red";
        // ele.innerHTML = `
        // <ul>
        //     <li>Interaction ID: ${i.ID}</li>
        //     <li>Start Time: ${i.start} sec</li>
        //     <li>End Time: ${i.end} sec</li>
        //     <li>Interaction Time: ${i['length (sec)']} sec</li>
        //     </ul>
        
        // `
    }
	// append the svg object to the body of the page
	const svg = d3.select("#timelineDiv")
        .attr("viewBox", "100,100,150,420")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + 100 + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);


	// var specifier = "%S";
	// var parsedData = ds1_UISegmented.map(function(d) {
	//     return d3.timeParse(specifier)(d)
	// });
	// var scale = d3.scaleTime()
	//     .domain(d3.extent(parsedData))
	//     .range([0, 6000]);
	// var axis = d3.axisBottom(scale)
	// .tickValues(parsedData)
	// .tickFormat(function(d) {
	//     return d3.timeFormat(specifier)(d)
	// });
	// var x = svg.append("g")
	// .attr("transform", `translate(0, ${height})`)
	// .call(axis)
	// Add X axis
	const x = d3.scaleLinear()
		.domain([0, 5500])
		.range([0, width]);
	svg.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(d3.axisBottom(x))
		// .tickValues(parsedData)
		// .tickFormat(function(d) {
		// return d3.timeFormat(specifier)(d)
		// })
		.selectAll("text")
		.style("text-anchor", "end");
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (margin.left - 40) + ", " + (height + (margin.bottom / 2.0) + 20) + ")")
		// .attr("x", width)
		// .attr("y", height - 6)
		.text("time (in seconds)");
	// Y axis
	const y = d3.scaleBand()
		.range([0, height])
		.domain(ds1_UISegmented.map(d => d.ID))
		.padding(.3);
	svg.append("g")
		.call(d3.axisLeft(y).tickValues([]))
		.call(g => g.select(".domain").remove())
	// svg.append("text")
	//     .attr("class", "y label")
	//     .attr("text-anchor", "middle")
	//     .attr("y", 6)
	//     .attr("transform", "translate(" + (margin.left - 120) + ", " + (height / 2.0) + ") rotate(-90)")
	//     .text("Interactions");
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
	// var colour = d3.scaleOrdinal(['#FF355E','#AAF0D1']);
	var colour = d3.scaleOrdinal(['#AAF0D1']);

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
		.attr("fill", function(d, i) {
			return colour(i);
		})

		.on('mouseover', function(d, i) {
			// console.log("id",i);
			// // alert(d.ID,d.start,d.end)
			// div.transition()		
			// .duration(200)		
			// .style("opacity", 1);		
			// div	.html(i.ID + "<br/>"  + i.start+ "<br/>"+i.end)
			// // .position("relative")
			// .style("left", (i.start+40) + "px")		
			// .style("top", (i.ID) + "px");
			d3.select(this).transition()
				.duration('10')
				.attr('opacity', '0.5')
			div.transition()
				.duration(100)
				.style("opacity", 1);
			div.html(
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
		.on('mouseout', function(d, i) {
			d3.select(this).transition()
				.duration('10')
				.attr('opacity', '1')
			div.transition()
				.duration(100)
				.style("opacity", 0);
			// d3.select(this).transition()
			// .duration('50')
			// .attr('opacity', '1')
		})
		.on('click', function(e, i) {
            if (prevElem) {
                prevElem.style("fill", prevColour);
            };
            prevElem = d3.select(this);
            prevColour = d3.select(this).style("fill");
            d3.select(this)
                .style('fill', 'orange');
            handleSegmentClick(i);
		})
	// .on('click', function (d, i) {
	//         d3.select(this).transition()
	//         .duration('50')
	//         .attr('opacity', '1')})
	initZoom()
})();