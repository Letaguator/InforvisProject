;(async function() {
	// Think_aloud interactions should be ignored in most cases, see Dataset README.txt
	async function readData(segmentationPath, interactionLog)
	{
		const segmentationPathComplete = "Data/Dataset_1/Segmentation/" + segmentationPath;
		const interactionLogComplete = "Data/Dataset_1/UserInteractions/" + interactionLog;

		return d3.csv(segmentationPathComplete).then(function(csvData){
			console.log(csvData)
			return d3.json(interactionLogComplete).then(function(jsonData){
				console.log(jsonData)

				// Compensate for errounous numbers for interactions
				jsonData = jsonData.map(interaction => {
					interaction.duration /= 10;
					interaction.time /= 10;
					return interaction;
				});
				
				var segmentInteractionData = csvData.map((segmentData) => {
					segmentData.interactions = jsonData.filter(interaction => {
						let interactionEndTime = interaction.time;
						// Compensate for only Reading and Doc_open interaction types having durations
						if(interaction.InteractionType === "Reading" || interaction.InteractionType === "Doc_open")
							interactionEndTime = interaction.time + interaction.duration;
						// interactionEndTime = interaction.time;

						return (interaction.time >= segmentData.start) && (interactionEndTime < segmentData.end);
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
				return segmentInteractionData;

			}).catch(function(error) { console.warn(error)} )
		}).catch(function(error) { console.warn(error)} )
	}

	// var files = fs.readdirSync('./Data/Dataset_1/UserInteractions/');

	// console.log(files)
	let segmentationPath1 = "Arms_P1_20_4_6_Prov_Segments.csv";
	let interactionLogPath1 = "Arms_P1_InteractionsLogs.json";

	let segmentInteractionArr = await readData(segmentationPath1,interactionLogPath1);
	console.log("Arr: ",segmentInteractionArr);
})();
