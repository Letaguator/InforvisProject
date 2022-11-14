// Think_aloud interactions should be ignored in most cases, see Dataset README.txt
// Some interactions are outside the segmentations
async function readDataAsync(segmentationPath, interactionLog)
{
	const segmentationPathComplete = "Data/Dataset_1/Segmentation/" + segmentationPath;
	const interactionLogComplete = "Data/Dataset_1/UserInteractions/" + interactionLog;

	return d3.csv(segmentationPathComplete).then(function(csvData){
		console.log(csvData)
		return d3.json(interactionLogComplete).then(function(jsonData){
			console.log(jsonData)

			// Compensate for errounous numbers for interactions
			jsonData = jsonData.map(interaction => {
				interaction.time = interaction.time / 10;
				// interaction.duration /= 10;
				return interaction;
			});
			
			var segmentInteractionData = csvData.map((segmentData) => {
				segmentData.interactions = jsonData.filter(interaction => {
					return (interaction.time >= segmentData.start) && (interaction.time < segmentData.end);
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

const FILEPATHS = [["Arms_P1_20_4_6_Prov_Segments.csv","Arms_P1_InteractionsLogs.json"],["Arms_P2_20_4_6_Prov_Segments.csv","Arms_P2_InteractionsLogs.json"],["Arms_P3_20_4_6_Prov_Segments.csv","Arms_P3_InteractionsLogs.json"],["Arms_P4_20_4_6_Prov_Segments.csv","Arms_P4_InteractionsLogs.json"],["Arms_P5_20_4_6_Prov_Segments.csv","Arms_P5_InteractionsLogs.json"],["Arms_P6_20_4_6_Prov_Segments.csv","Arms_P6_InteractionsLogs.json"],["Arms_P7_20_4_6_Prov_Segments.csv","Arms_P7_InteractionsLogs.json"],["Arms_P8_20_4_6_Prov_Segments.csv","Arms_P8_InteractionsLogs.json"]];

const userSelectorDiv = document.getElementById("userSelectorDiv");
const buttons = [];
let currentSelection = "P1";
function populateUserSelector()
{
	for(let i = 0; i < 8; i++)
	{
		const button = document.createElement("button");
		buttons.push(button);
		button.className = "userSelectionButton";
		button.innerHTML = "User " + (i + 1);
		button.onclick = (evt) => {
			let targetUser = "P" + (i + 1);
			buttons.forEach(btn => {
				btn.style = "";
			});
			button.style = "background-color: #4ca3e0";
			FILEPATHS.map(vals => [vals[0].replace(currentSelection, targetUser), vals[1].replace(currentSelection, targetUser)]);
			currentSelection = targetUser;
			drawCharts();
		};
		userSelectorDiv.appendChild(button);
	}
}
populateUserSelector();
