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
	populateCVCMenus('initialize','P','');
	populateSLICE();
		//Give statistics of the overall sample:
	var myArray = [];
	for (var i=0; i<studentBackgroundsJson.length; i++){
		myArray.push(studentBackgroundsJson[i]["StudentId"]);
	}
	var text = getBackgroundInfo(myArray);
	$("#statisticsOverallBackground").empty();
	$("#statisticsOverallBackground").append(text);

	//update menus when you click on them. Plot that too.
	$(".xMenu, .pMenu").click(function() {
		//reset the OtherScores in case you change assignments but it still reads otherScores
		var thisSelect  = $(this).closest("select").attr("id");
		var thisAxis = thisSelect.slice(-1);	

		populateCVCMenus('populate',thisAxis,$(this))
		if (thisAxis === 'X' || thisAxis === 'Y'){
			showStatistics();
			plotCVC();
			//populateTags();
		}
	});

	$("#cvcOtherScoresX").click(function(){
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
		populateCVCMenus('initialize','X','');
		populateCVCMenus('initialize','P','');
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
});
