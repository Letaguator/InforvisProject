(async function () {
  // Data preperation
  let ds1_UISegmented = await readDataAsync(FILEPATHS[0][0], FILEPATHS[0][1]);
  console.log("Timeline arr data: ", ds1_UISegmented );
  // ds1_UISegmented.reverse();

  var container = document.getElementById('timelineDiv');
  var items = new vis.DataSet(ds1_UISegmented);
  // var items = new vis.DataSet([
  //   {id: 1, content: 'item 1', start: '2013-04-20'},
  //   {id: 2, content: 'item 2', start: '2013-04-14'},
  //   {id: 3, content: 'item 3', start: '2013-04-18'},
  //   {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
  //   {id: 5, content: 'item 5', start: '2013-04-25'},
  //   {id: 6, content: 'item 6', start: '2013-04-27'}
  // ]);

  var options = {
    // min:0,
    // max: 5500,
    maxHeight: 200,
    showCurrentTime : false,
    horizontalScroll: true,
    showTooltips: true
  };
  var timeline = new vis.Timeline(container, items, options);
  })();