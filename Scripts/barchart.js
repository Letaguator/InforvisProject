;(async function() {


    // -----

	let segmentationPath1 = "Arms_P1_20_4_6_Prov_Segments.csv";
	let interactionLogPath1 = "Arms_P1_InteractionsLogs.json";

	let segmentInteractionArr = await readDataAsync(segmentationPath1, interactionLogPath1);
	console.log("Arr: ", segmentInteractionArr);
})();
