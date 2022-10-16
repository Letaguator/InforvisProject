;(async function() {


	let ds1_UISegmented = await readDataAsync(FILEPATHS[0][0], FILEPATHS[0][1]);
	console.log("Arr: ", ds1_UISegmented );
    // -----
    // Format [{actionName, Count}, {actionName, Count}, {actionName, Count}, {actionName, Count}, {actionName, Count}]
	let segmentationPath1 = "Arms_P1_20_4_6_Prov_Segments.csv";
	let interactionLogPath1 = "Arms_P1_InteractionsLogs.json";

	let segmentInteractionArr = await readDataAsync(segmentationPath1, interactionLogPath1);
	console.log("Arr: ", segmentInteractionArr);
})();
