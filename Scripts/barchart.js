;(async function() {


	let ds1_UISegmented = await readDataAsync(FILEPATHS[0][0], FILEPATHS[0][1]);
	console.log("Arr: ", ds1_UISegmented );

	//creating set of interaction types 
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

	

	
    // -----
    // Format [{actionName: name, Count:count}, {actionName, Count}, {actionName, Count}, {actionName, Count}, {actionName, Count}]
	let segmentationPath1 = "Arms_P1_20_4_6_Prov_Segments.csv";
	let interactionLogPath1 = "Arms_P1_InteractionsLogs.json";

	let segmentInteractionArr = await readDataAsync(segmentationPath1, interactionLogPath1);
	console.log("Arr: ", segmentInteractionArr);
})();
