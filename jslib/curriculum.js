/**
 * @author Xavier Prat-Resina
 */
$(function(){
	//check radio-button
	
	rebuildTable(curriculumArray);
	//on change radio-button
	$("#curriculumLevel input, #statisticalOption input").change(function(){
		rebuildTable(curriculumArray);
	});
});
