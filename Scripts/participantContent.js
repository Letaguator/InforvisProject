var participantId = 0;
async function drawCharts() {
    // Data preperation
	console.log(participantId);
	let ds1_UISegmented = await readDataAsync(FILEPATHS[participantId][0], FILEPATHS[participantId][1]);
	console.log("Arr: ", ds1_UISegmented );


	// Creating set of interaction types 
	const interactionTypes = new Set()
	for(let i = 0; i < ds1_UISegmented.length; i++){
		for(let j = 0; j < ds1_UISegmented[i].interactions.length; j++){
			interactionTypes.add(ds1_UISegmented[i].interactions[j].InteractionType)
		}
	}

	interactionTypes.delete("Think_aloud");
	console.log("Interaction Types: ", interactionTypes)
	let interactionCount = [];

	for (const item of interactionTypes) {
		let obj = {actionName: item,count: 0};
		interactionCount.push(obj);
	}

	for(let i = 0; i < ds1_UISegmented.length; i++){
		for(let j = 0; j < ds1_UISegmented[i].interactions.length; j++){
			if(ds1_UISegmented[i].interactions[j].InteractionType != "Think_aloud"){
				let entry = interactionCount.find(item =>item.actionName === ds1_UISegmented[i].interactions[j].InteractionType);
				++entry.count;
			}
			
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
		var participantChartsDiv = document.getElementById("participantDivContent");
        while (participantChartsDiv.lastElementChild) {
            participantChartsDiv.removeChild(participantChartsDiv.lastElementChild);
        }

		const selectedSegHeader = document.getElementById("selectedSegHeader");
		selectedSegHeader.innerText = 
		`Select Segment to Display Data`
	participantChartsDiv.style.display = "block";
	participantChartsDiv.style.width = 600;
	participantChartsDiv.style.height = 600;
	// Documents visited for the longest time
	var y =  Math.max(...top10Documents.map(o => o.duration))
		docVisitsBarChart = BarChart(
			top10Documents,
			{
				x: (d) => d.documentName,
				y: (d) => d.duration,
				yLabel: "Seconds",
				yDomain: [0, y],
				width: 500,
				height: 500,
				xPadding: 0.3,
				color: "darkblue",
				title: "Longest Visited Documents"
			})
		
			participantChartsDiv.append(docVisitsBarChart);
	

	
    // Interaction Count Chart
	interactionCount = interactionCount.sort((a, b) => b.count - a.count);
    var interactionY =  Math.max(...interactionCount.map(o => o.count))
	barChart = BarChart(
        interactionCount,
        {
            x: (d) => d.actionName,
            y: (d) => d.count,
            yLabel: "Count",
            yDomain: [0, interactionY],
            width: 500,
            height: 500,
            xPadding: 0.3,
            color: "darkblue",
			title: "Interaction Count"
        })
    
		participantChartsDiv.append(barChart);

		
	// Word Cloud for Text Participant Searched For 

	let searchedWordsArr = []
	for(let i = 0; i < ds1_UISegmented.length; i++){
		for(let j = 0; j < ds1_UISegmented[i].interactions.length; j++){
			if(ds1_UISegmented[i].interactions[j].InteractionType === "Search"){
				searchedWordsArr.push(ds1_UISegmented[i].interactions[j].Text)
			}
		}
	}

	console.log("CWC: ", searchedWordsArr)

	wordCloud = WordCloud(searchedWordsArr, {
		height: 500
	});
	participantChartsDiv.append(wordCloud)



}

drawCharts();
