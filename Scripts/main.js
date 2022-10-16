;(function() {
	// Think_aloud interactions should be ignored in most cases, see Dataset README.txt
	function readData(segmentationPath, interactionLog)
	{
		const segmentationPathComplete = "Data/Dataset_1/Segmentation/" + segmentationPath;
		const interactionLogComplete = "Data/Dataset_1/UserInteractions/" + interactionLog;

		d3.csv(segmentationPathComplete).then(function(csvData) {
			console.log(csvData)
			d3.json(interactionLogComplete).then(function(jsonData) {
				console.log(jsonData)
				
				var segmentInteractionData = csvData.map((segmentData) => {
					segmentData.interactions = jsonData.filter(interaction => {
						// Compensate for errounous numbers for interactions
						interaction.duration /= 10;
						interaction.time /= 10;
						
						interactionEndTime = interaction.time + interaction.duration;
						if(interaction.InteractionType != "Reading" && interaction.InteractionType != "Doc_open")
							interactionEndTime = interaction.time;
						// interactionEndTime = interaction.time;

						return interaction.time >= segmentData.start && interactionEndTime <= segmentData.end;
					});
					return segmentData;
				});

				console.log(segmentInteractionData);
				let count = 0;
				segmentInteractionData.forEach(segment => {
					segment.interactions.forEach(interaction => {
						count++;
					})
				});
				console.log(count)

			}).catch(function(error) { console.warn(error)} )
		}).catch(function(error) { console.warn(error)} )
	}

	readData("Arms_P1_20_4_6_Prov_Segments.csv", "Arms_P1_InteractionsLogs.json");
})();
