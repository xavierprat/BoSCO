/**
 * @author Xavier Prat-Resina
 */
$(function(){
	//lets first reset all the select menus
	$(".xMenu, .yMenu, .pMenu, .qMenu, #cvcOtherScoresX, #cvcOtherScoresY, #cvcOtherScoresP, #cvcOtherScoresQ").each(function(){
		$(this).prop('selectedIndex',0);
	});
	//populate the course menu
	populateCVCMenus('initialize','X','');
	populateCVCMenus('initialize','Y','');
	populateCVCMenus('initialize','P','');
	populateCVCMenus('initialize','Q','');
	//check if there's a query
	var thisURL0 = unescape(window.location.search.substring(1));
	var thisURL = thisURL0.split('&');
	var query = {};
	for (var i=0; i < thisURL.length; i++){
		var fields = thisURL[i].split("=");
		query[fields[0]] = fields[1];
	}

	if ( 'xquery' in query || 'yquery' in query ){
		if ('xquery' in query ) populateCVCMenus('query','X',query.xquery);
		if ('yquery' in query ) populateCVCMenus('query','Y',query.yquery);
		showStatistics();
		plotCVC();
	}

	//Give statistics of the overall sample:
	var myArray = [];
	for (var i=0; i<studentBackgroundsJson.length; i++){
		myArray.push(studentBackgroundsJson[i]["StudentId"]);
	}
	var text = getBackgroundInfo(myArray);
	$("#statisticsOverallBackground").empty();
	$("#statisticsOverallBackground").append(text);

	//update menus when you click on them. Plot that too.
	$(".xMenu, .yMenu, .pMenu, .qMenu").change(function() {
		//reset the OtherScores in case you change assignments but it still reads otherScores
		var thisSelect  = $(this).closest("select").attr("id");
		var thisAxis = thisSelect.slice(-1);	

		populateCVCMenus('populate',thisAxis,$(this))
		if (thisAxis === 'X' || thisAxis === 'Y'){
			showStatistics();
			plotCVC();
			populateTags();
		}
	});

	$("#cvcOtherScoresX, #cvcOtherScoresY").click(function(){
		var thisSelect  = $(this).closest("select").attr("id");
		var thisAxis = thisSelect.slice(-1);
		//unselect all the assignment options
		$("#cvcMenuAssignment"+thisAxis+" option").attr("selected",false);
		showStatistics();
		plotCVC();
	});
	$("#downloadCSV").click(function(){ downloadSelection(); });
	$("#reset").click(function(){ 
		$("#graphTitle").empty(); 
		$("#placeholder").empty(); 
		$("#selectGraphType").css("visibility", "hidden");
		$("#barGraphButton").prop("checked",true);
		$("#barGraphButton").button("refresh");
		populateCVCMenus('initialize','X','');
		populateCVCMenus('initialize','Y','');
		populateCVCMenus('initialize','P','');
		populateCVCMenus('initialize','Q','');
		showStatistics();
	});
	$("#filterButtonX, #filterButtonY").click(function(){ 
		showStatistics();
		plotCVC();
	});
	$("#resetFilter").click(function(){ 
		$(".filterCategoryVariablesX, .filterCategoryVariablesY ").each(function(){
			$(this).prop('checked', true);
		});
		populateCVCMenus('initialize','P','');
		populateCVCMenus('initialize','Q','');
		showStatistics();
		plotCVC();
	});
	$("#graphTitle button").click(function(){plotCVCscatter();});
	$("#diagonal").click(function(){plotCVC();});
	$("#selectGraphType input").on('change',function(){plotCVC();});
	
});