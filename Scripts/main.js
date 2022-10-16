;(function() {
	function readData(path)
	{
		let segmentationPath = "Data/Dataset_1/Segmentation/Arms_P1_20_4_6_Prov_Segments.csv";
		let interactionLog = "Data/Dataset_1/UserInteractions/Arms_P1_InteractionsLogs.json";

		d3.csv(segmentationPath).then(function(csvData){
			console.log(csvData)
			d3.json(interactionLog).then(function(jsonData){
				console.log(jsonData)
				
			}).catch(function(error) {console.warn(error)})
		}).catch(function(error) {console.warn(error)})
	}

	readData();
})();
