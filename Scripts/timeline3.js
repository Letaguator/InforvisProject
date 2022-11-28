async function drawTimeline() {
	// Data preperation
	let ds1_UISegmented = await readDataAsync(FILEPATHS[participantId][0], FILEPATHS[participantId][1]);
	console.log("Timeline arr data: ", ds1_UISegmented);
	ds1_UISegmented.reverse();
	// set the dimensions and margins of the graph
	const getAllDocs = ()=>{
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
		return sortedDocKeys;
	}
	const margin = {
			top: 20,
			right: 30,
			bottom: 40,
			left: 90
		},
		width = 5000 - margin.left - margin.right,
		// height = 500 - margin.top - margin.bottom;
		height = 100;
	var actionOptionsSelected;
	const getActions = (i)=>{
		const interactionTypes = new Set()
        for (let j = 0; j < i.interactions.length; j++){
            interactionTypes.add(i.interactions[j].InteractionType)
        }
        interactionTypes.delete("Think_aloud");
	    console.log("Interaction Types @ time segment: ", Array.from(interactionTypes));
		return Array.from(interactionTypes);
	};
	var timelinediv = document.getElementById("timelineDiv");
	timelinediv.style = "border-top: 8px solid #4ca3e0;;";
	timelinediv.innerHTML = 
	`
	<h2>Segementations Timeline</h2>
	<label for="actions">Highlight By Action:</label>

	<select name="actions" id="actions">
	  <option disabled selected value> -- select an option -- </option>
	  <option value="Draging">Draging</option>
	  <option value="Reading">Reading</option>
	  <option value="Mouse_hover">Mouse_hover</option>
	  <option value="Doc_open">Doc_open</option>
	  <option value="Search">Search</option>
	  <option value="Highlight">Highlight</option>
	  <option value="Connection">Connection</option>
	  <option value="Topic_change">Topic_change</option>
	  <option value="Create Note">Create Note</option>
	  <option value="Add note">Add note</option>
	</select>
	<label for="docs">Highlight By Document:</label>

	<select name="docs" id="docs">
	  <option disabled selected value> -- select an option -- </option>
	</select>
	`;
	var allDocs = getAllDocs();
	var docsSelect = document.getElementById('docs');
	for (var i = 0; i < allDocs.length; i++) {
		var option = document.createElement('option');
		// option.value(allDocs[i]);
		option.setAttribute("value", allDocs[i]);
		option.text = allDocs[i];
		docsSelect.appendChild(option);
	}
	docsSelect.addEventListener("change", function() {
		d3.selectAll(timesegments).style("fill", "#AAF0D1")
		// var val = document.getElementById("actions").value;
		// console.log("----------------");
		// console.log(docsSelect.value);
		var docsSelectSelected = docsSelect.value;
		d3.selectAll(timesegments).filter(function(d, i) {
			var currDocs = getDocs(d);
			return currDocs.includes(docsSelectSelected);
		  }).style('fill', 'yellow');
	  });
	
	// docsSelect.options[allDocs.length] = new Option(`${allDocs}`, `${allDocs}`);
	// var actionsList = getActions();
	var actionsOptions = document.getElementById('actions');
	actionsOptions.addEventListener("change", function() {
		d3.selectAll(timesegments).style("fill", "#AAF0D1")
		// var val = document.getElementById("actions").value;
		// console.log("----------------");
		// console.log(actionsOptions.value);
		actionOptionsSelected = actionsOptions.value;
		d3.selectAll(timesegments).filter(function(d, i) {
			// console.log("Documents of selected segment: @timeline", docs);
			// console.log("data inside the filter @timeline", d);
			var currActions = getActions(d);
			// console.log("docs in filter @timeline", currDocs);
			return currActions.includes(actionOptionsSelected);
			// const intersection = docs.filter(element => currDocs.includes(element));
			// console.log("common docs @timeline",i,":",intersection);
			// if(intersection.length>0){
			// 	console.log("to be highlighted @ timeline",i);
			// 	return true;
			// }
			// return i % 2 === 0;
		  }).style('fill', 'green');
	  });
	// var prevElem, prevColour;
	// actionsOptions.onchange = (e)=>{
	// 	console.log("----------------");
	// 	console.log(e);
	// 	// alert(e.target);
	// }
	// var handleActionsOption = ()=>{
	// 	var val = document.getElementById("actions").value;
	// 	console.log("----------------");
	// 	console.log(val);
	// 	// alert(e.target);
	// }

	var div = d3.select("#timelineDiv").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

    const handleSegmentClick = (i) => {
        const interactionTypes = new Set()
        for (let j = 0; j < i.interactions.length; j++){
            interactionTypes.add(i.interactions[j].InteractionType)
        }
        interactionTypes.delete("Think_aloud");
	    // console.log("Interaction Types @ time segment: ", Array.from(interactionTypes));
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

		// let data = i;
		return sortedDocKeys;
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
	const getDocs = (i) => {
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

		return sortedDocKeys;
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
	var timesegments = svg.selectAll("myRect")
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
			d3.selectAll(timesegments).style("fill", "#AAF0D1")
			// d3.select(this).style("fill", "red")
            // if (prevElem) {
            //     prevElem.style("fill", prevColour);
            // };
            // prevElem = d3.select(this);
            // prevColour = d3.select(this).style("fill");
            d3.select(this)
                .style('fill', 'orange');
            var docs = handleSegmentClick(i);
			d3.selectAll(timesegments)
			.filter(function(d, i) {
				// console.log("Documents of selected segment: @timeline", docs);
				// console.log("data inside the filter @timeline", d);
				var currDocs = getDocs(d);
				// console.log("docs in filter @timeline", currDocs);
				const intersection = docs.filter(element => currDocs.includes(element));
				// console.log("common docs @timeline",i,":",intersection);
				if(intersection.length>0){
					console.log("to be highlighted @ timeline",i);
					return true;
				}
				// return i % 2 === 0;
		  	}).style('fill', 'red');
			d3.select(this)
			  .style('fill', 'orange');
		})
		// if(actionOptionsSelected !== ""){
		// 	d3.selectAll(timesegments).style('fill', 'cyan');
		// }
	// .on('click', function (d, i) {
	//         d3.select(this).transition()
	//         .duration('50')
	//         .attr('opacity', '1')})
	initZoom()
}
drawTimeline();