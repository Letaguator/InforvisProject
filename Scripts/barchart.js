;(async function() {
    // Data preperation
	let ds1_UISegmented = await readDataAsync(FILEPATHS[0][0], FILEPATHS[0][1]);
	console.log("Arr: ", ds1_UISegmented );

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

	for(let i =0; i < interactionCount.length; i++){
		console.log(interactionCount[i]);
	}
	
    // Data loading
    
    var barchartDiv = document.getElementById("barchartDiv");
    barchartDiv.style.width = 600;
    barchartDiv.style.height = 600;

    barChart = BarChart(
        interactionCount,
        {
            x: (d) => d.actionName,
            y: (d) => d.count,
            yLabel: "Count",
            yDomain: [0, 200],
            width: 700,
            height: 600,
            xPadding: 0.3,
            color: "darkgreen"
        })
    
    barchartDiv.append(barChart);
    
})();
