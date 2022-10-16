;(async function() {


	let ds1_UISegmented = await readDataAsync(FILEPATHS[0][0], FILEPATHS[0][1]);
	console.log("Arr: ", ds1_UISegmented );
    // -----
    // Format [{actionName, Count}, {actionName, Count}, {actionName, Count}, {actionName, Count}, {actionName, Count}]
})();
