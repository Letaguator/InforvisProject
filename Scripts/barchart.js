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
	// Documents visited for the longest time
		var docVisitsBarchartDiv = document.getElementById("docVisitsBarchartDiv");
		docVisitsBarchartDiv.style.width = 600;
		docVisitsBarchartDiv.style.height = 600;
	
		docVisitsBarChart = BarChart(
			top10Documents,
			{
				x: (d) => d.documentName,
				y: (d) => d.duration,
				yLabel: "Seconds",
				yDomain: [0, 1500],
				width: 500,
				height: 500,
				xPadding: 0.3,
				color: "tomato"
			})
		
			docVisitsBarchartDiv.append(docVisitsBarChart);
	

	
    // Interaction Count Chart
    
    var barchartDiv = document.getElementById("barchartDiv");
    barchartDiv.style.width = 600;
    barchartDiv.style.height = 600;

	interactionCount = interactionCount.sort((a, b) => b.count - a.count);
    barChart = BarChart(
        interactionCount,
        {
            x: (d) => d.actionName,
            y: (d) => d.count,
            yLabel: "Count",
            yDomain: [0, 200],
            width: 500,
            height: 500,
            xPadding: 0.3,
            color: "darkgreen"
        })
    
    barchartDiv.append(barChart);
    
})();
