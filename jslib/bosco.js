/**
 * @author Xavier Prat-Resina
 */
var notAssignments = ['Course','Semester','Section','StudentId','Final letter'];
var ethnicities = [{ "B":"Black", "W":"White", "I":"American Indian", "A":"Asian/Pacific", "H":"Hispanic/Chicano/Latino","N":"NS", "U":"Unknown"}];
//void require('http://bit.ly/ss-js');
Object.objSize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function populateCVCMenus(thisAction,axis,thisObject){
	$("#cvcOtherScores"+axis).prop('selectedIndex',0)
	if (thisAction == 'initialize'){
		//Instead of populating only the courses, all options/all levels should be available
		//and upon click update the possible combinations
		//empty all
		$("#cvcMenuCourse"+axis).empty();
		$("#cvcMenuSemester"+axis).empty();
		$("#cvcMenuSection"+axis).empty();
		$("#cvcMenuAssignment"+axis).empty();
		//$("#cvcMenuQuestion"+axis).empty();
		var myCourses = [];
		$.each(coursesJson,function(i,v){
			if ($.inArray(v.Course,myCourses) == -1 ) myCourses.push(v.Course);
		});
		//populate only courses for X, Y and P,Q
		$.each(myCourses,function(i,v){
			$("#cvcMenuCourse"+axis).append('<option value="' + v + '" >'+ v +'</option>');
		});
		if (axis === 'P'){
			$(".filterCategoryVariablesX").each(function(){
				$(this).prop('checked', true);
			});
			$("#filterNumericalVariablesX").prop('checked', false);
		}
		if (axis === 'Q'){
			$(".filterCategoryVariablesY").each(function(){
				$(this).prop('checked', true);
			});
			$("#filterNumericalVariablesY").prop('checked', false);
		}
	}	
	if (thisAction == 'populate'){
		var thisSelect  = thisObject.closest("select").attr("id");
		//theseOptions is an array as long as the select is labeled as multiple
		var theseOptions = thisObject.val();
		var thisLevel = thisSelect.match(/[A-Z][a-z]+/g)[1];
		var axis = thisSelect.slice(-1);	
		if (thisLevel === 'Course'){
			$("#cvcOtherScores"+axis).prop('selectedIndex',0)
			var mySemesters = [];
			$("#cvcMenuSemester"+axis).empty();
			$("#cvcMenuSection"+axis).empty();
			$("#cvcMenuAssignment"+axis).empty();
			$("#cvcMenuCourse"+axis+" option:selected").each(function(){
				var thisCourse = $(this).val();
				if (thisCourse !== theseOptions) alert("Oh oh: "+thisCourse+"="+thisLevel);
				$("#cvcMenuSemester"+axis).append(function(){
					var output = '';
					$.each(coursesJson,function(i,v){
						if ( thisCourse == v.Course && $.inArray(v.Semester,mySemesters) == -1 ) {
							output += '<option value="'+v.Semester+'">'+v.Semester+'</option>';
							mySemesters.push(v.Semester);
						}
					});
					return output;
				});
			}); 
		}
		if (thisLevel === 'Semester'){
			$("#cvcMenuSection"+axis).empty();
			$("#cvcMenuAssignment"+axis).empty();
			var thisCourse = $("#cvcMenuCourse"+axis+" option:selected").val();
			var thisSemester = $("#cvcMenuSemester"+axis+" option:selected").val();
			if (thisSemester !== theseOptions) alert("Oh oh: "+thisSemester+"="+thisLevel);
			//populate sections
			$("#cvcMenuSemester"+axis+" option:selected").each(function(){
				var thisSemester = $(this).val();
				$("#cvcMenuSection"+axis).append(function(){
					var output = '';
					$.each(coursesJson, function(i,v) {
						if ( thisSemester == v.Semester && thisCourse == v.Course ){
							output += '<option value="'+v.Section+'">'+v.Section+'</option>';
						} 
					});
					return output;
				});
			});
			//Do all sections have the same assignments?
			$("#cvcMenuSection"+axis+" option").attr("selected","selected");
			for (var i=0; i<studentGradesJson.length; i++){
				var student = studentGradesJson[i];
				// consider including section in the future: different sections may have different assignments
				if (student.Course === thisCourse && student.Semester === thisSemester){
					$.each(student, function(key,value){
						$("#cvcMenuAssignment"+axis).append(function(){
							//instead of notAssignments, just use all columns after section
							//var key2 = key.match(/.{1,15}/g).join("<br/>");
							var key2 = key.substring(0,45);
							if ($.inArray(key,notAssignments) == -1){
								if ( key == "Total Grade"){
								 	return	'<option selected="selected" value="'+key+'">'+key2+'</option>'; 
								}else{
									
									return	'<option value="'+key+'">'+key2+'</option>'; 
								}
							}
						})
					});
					break;
				}
			};
		}
		if (thisLevel === 'Assignment'){
			//TODO
		}
	}
	if (thisAction == 'query'){
		if ( thisObject.split(";").length == 1 ){
			//this is just a course
			//var thisCourse = thisObject.split(" ")[0];
			var thisCourse = thisObject;
			$("#cvcMenuCourse"+axis).val(thisCourse);
			populateCVCMenus('populate',axis, $("#cvcMenuCourse"+axis));
		}else if ( thisObject.split(";").length == 2 ){
			var thisCourse = thisObject.split(";")[0];
			var thisSemester = thisObject.split(";")[1];
			$("#cvcMenuCourse"+axis).val(thisCourse);
			populateCVCMenus('populate',axis, $("#cvcMenuCourse"+axis));
			$("#cvcMenuSemester"+axis).val(thisSemester);
			populateCVCMenus('populate',axis, $("#cvcMenuSemester"+axis));
		}else if ( thisObject.split(";").length == 3 ){
			var thisCourse = thisObject.split(";")[0];
			var thisSemester = thisObject.split(";")[1];
			var thisAssignment = thisObject.split(";")[2];

			$("#cvcMenuCourse"+axis).val(thisCourse);
			populateCVCMenus('populate',axis, $("#cvcMenuCourse"+axis));
			$("#cvcMenuSemester"+axis).val(thisSemester);
			populateCVCMenus('populate',axis, $("#cvcMenuSemester"+axis));
			//TODO
			//all sections
			//$("#cvcMenuSection"+axis+"  option").prop('selected', true);
			//$("#cvcMenuAssignment"+axis).val(thisAssignment);
			//populateCVCMenus('populate',axis, $("#cvcMenuAssignment"+axis));
		}
	}
}
function populateTags(){
	//get the tags for X and print them
	//get the tags for Y and print them
	//find the common tags between X and Y and print them
}
function getBackgroundInfo(myStudentIds){
	//for the time being it seems faster to create this array than to store it
	var myArray = [];
	var alreadyThere = [];
	for (var i=0; i<myStudentIds.length; i++){
		var thisId = myStudentIds[i];
		var thisProfile = $.grep(studentBackgroundsJson,function(v,i){
			return v.StudentId === thisId;
		});
		if (thisProfile.length < 1){
			console.log("Student not there "+thisId);
		}else{
			if ($.inArray(thisId,alreadyThere) == -1 ){
				myArray.push(thisProfile[0]);
				alreadyThere.push(thisId);
			}
		}
	};
	var text = "<li>Number of students: "+myArray.length+"</li>";
	   text += "<li>Sex: "+countInJson(myArray,'Sex','M')+" males, "
	   						 +countInJson(myArray,'Sex','F')+" females</li>";
	   text += "<li>Race/Ethnicity: White :"+countInJson(myArray,'Ethnicity','White')+
	   							", Black :"+countInJson(myArray,'Ethnicity','Black')+
	   							", Asian :"+countInJson(myArray,'Ethnicity','Asian')+
	   							", Hispanic :"+countInJson(myArray,'Ethnicity','Hispanic')+
	   							", Am-Indian :"+countInJson(myArray,'Ethnicity','Am. Indian')+
	   							", Other :"+countInJson(myArray,'Ethnicity','NS')+
	   							"</li>";
	   /*
	   text += "<li>First generation. Yes: "+countInJson(myArray,'FirstGeneration','Y')+
	   								  " No: "+countInJson(myArray,'FirstGeneration','N')+"</li>";
		*/					
	   text += "<li>Average GPA: "+countInJson(myArray,'Cumulative GPA','')+"</li>";
	   text += "<li>Average ACT-math: "+countInJson(myArray,'ACT-math','')+"</li>";
	return text;
}
function countInJson(myArray,myKey,myValue){
	
	var count = 0;
	if (myValue == ''){
		//it's a numerical field not category. Do the aveareg and SD instead of counting them
		var myNumber = [];
		for (var i=0; i<myArray.length; i++){
			//we count zeros but not empy arrays
			//if (myArray[i][myKey] != "") myNumber.push(myArray[i][myKey]);
			if ( ! isNaN(myArray[i][myKey]) ){
				if (myArray[i][myKey]>0) myNumber.push(myArray[i][myKey]);
			} 
		}
		if (myNumber.length > 0) var count = ss.mean(myNumber).toFixed(3)+" +/- "+ss.standard_deviation(myNumber).toFixed(3);
	}else if (myValue == 'auto'){
		//this should detect all the fields
	}else{
		var count = 0;
		for (var i=0; i<myArray.length; i++){
			if ( myArray[i].hasOwnProperty(myKey)){
				if (myArray[i][myKey] === myValue){
					 count += 1;
				}
			}
		}
	}
	
	return count;
}
//http://jsfromhell.com/array/average A tiny-nice mean/stdDev/var function
average = function(a){
    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
    for(var m, s = 0, l = t; l--; s += a[l]);
    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
    return r.deviation = Math.sqrt(r.variance = s / t), r;
}
function showStatistics(){
	//return [pairedData,pairedStudents,unpairedData,unpairedStudents,[xQuery,yQuery,xFilterBack,yFilterBack]]
	var dataMatch = returnSelection();
	var pairedData = dataMatch[0];
	var pairedStudents = dataMatch[1];
	var unpairedData = dataMatch[2];
	var unpairedStudents = dataMatch[3];
	
	//X - Y separated (unpaired)
	var d1X = [];
	var d1Y = [];
	var studentsIdX = [];
	var studentsIdY = [];
	for (var i=0; i<unpairedData.length; i++){
		if ( unpairedData[i][0] !== "" ) d1X.push(unpairedData[i][0]);
		if ( unpairedData[i][1] !== "" ) d1Y.push(unpairedData[i][1]);
		if ( unpairedStudents[i][0] !== "" ) studentsIdX.push(unpairedStudents[i][0]);
		if ( unpairedStudents[i][1] !== "" ) studentsIdY.push(unpairedStudents[i][1]);
	}
	$("#showStatisticsX").empty();
	$("#statisticsBackgroundX").empty();
	if (d1X.length > 0){
		//var text  = "<li>Number of students: "+d1X.length+"</li>";
		//$("#showStatisticsX").append(text);
	    var textBack  = getBackgroundInfo(studentsIdX);
	    var text = "<li>Average final Grade: "+ss.mean(d1X).toFixed(3)+" +/- "+ss.standard_deviation(d1X).toFixed(3)+"</li>";
	    textBack += text;
		$("#statisticsBackgroundX").append(textBack);
	}
	$("#showStatisticsY").empty();
	$("#statisticsBackgroundY").empty();
	if (d1Y.length > 0){
		//var text  = "<li>Number of students: "+d1Y.length+"</li>";
		//$("#showStatisticsY").append(text);
	    var textBack  = getBackgroundInfo(studentsIdY);
	    var text = "<li>Average final Grade: "+ss.mean(d1Y).toFixed(3)+" +/- "+ss.standard_deviation(d1Y).toFixed(3)+"</li>";
	    textBack += text;
		$("#statisticsBackgroundY").append(textBack);
	}
	//XY-paired	
	$("#showStatisticsXYpaired").empty();
	$("#statisticsBackgroundXYpaired").empty();
	if (pairedData.length>0){
		var myData = doLeastSquare(pairedData);
		var line = myData[1];
		var yIntercept = line(0);
		var slope = line(1) - yIntercept;
		r2 = myData[0];
		//var textP = "<li>Number of students in X: "+pairedData.length+"</li>";
		//	textP += "<li>Number of students in Y: "+pairedData.length+"</li>";
			/*
		var cov = ss.sample_covariance(d1X,d1Y);
			textP += "<li>Covariance of the sample = "+cov.toFixed(3)+"</li>";
			textP += "<li>Pearson correlation coefficient = "+cov/(s2X*s2Y)+"</li>";
			*/
			//textP += "<li>TODO: Cov. for diff. sizes<br> Careful I'm mixing sample and population</li>";
		//$("#showStatisticsXYpaired").append(textP);
		var textP = "<li>Least square fit: slope = "+slope.toFixed(3)+"<br> Y-intercept = "+yIntercept.toFixed(3)+" R2 = "+r2.toFixed(5)+"</li>";
		var textBack  = getBackgroundInfo(pairedStudents);
		textBack += textP;
		$("#statisticsBackgroundXYpaired").append(textBack);
	}
	//XY-unpaired	
	$("#showStatisticsXYunpaired").empty();
	if (d1X.length > 0 && d1Y.length > 0){
	//t-test: https://en.wikipedia.org/wiki/Student%27s_t-test#Unequal_.28or_equal.29_sample_sizes.2C_unequal_variances
		var s2X = ss.variance(d1X);
		var s2Y = ss.variance(d1Y);
		var tTest = (ss.mean(d1X)-ss.mean(d1Y))/(Math.sqrt( s2X/d1X.length + s2Y/d1Y.length));
		var textU = "<li>Number of students in X: "+d1X.length+"</li>";
			textU += "<li>Number of students in Y: "+d1Y.length+"</li>";
			textU += "<li>Student t-test: "+tTest+"</li>";
		//$("#showStatisticsXYunpaired").append(textU);
	}
}
function returnMenuSelection(menuObject){
	var query = [];
	menuObject.each(function(){
		var thisSelect  = $(this).closest("select").attr("id");
		//var thisOption = $(this).val();
		var thisItem = thisSelect.match(/[A-Z][a-z]+/g)[1];
		//var thisAxis = thisSelect.slice(-1);
		var thisOption = []
		$("#"+this.id+" option:selected").each(function(key,value){
			thisOption.push($(this).val());
		});
		if (thisOption.length > 0){
			if (! query.hasOwnProperty(thisItem)) query[thisItem] = [];
			for (var i=0; i<thisOption.length; i++){
				query[thisItem].push(thisOption[i]);
			}
		}
	})
	//if you haven't selected an assignment add the final grade
	if (Object.objSize(query) > 0 && ! query.hasOwnProperty('Assignment') ) {
		query['Assignment'] = [];
		//Total Grade is how iSEAL calls the final grade. It has to be named this way!
		query['Assignment'].push('Total Grade');
	}
	return query;
}
function returnBoxSelection(menuObject){
	var query = [];
	menuObject.each(function(){
		if ( ! $(this).is(":checked") ){
			var thisValue = $(this).val();
			var thisItem  = thisValue.slice(0,thisValue.length-1);
			console.log("change this to make filter work");
			var thisOption = thisValue.slice(-1);
			if (thisOption){
				if (! query.hasOwnProperty(thisItem)) query[thisItem] = [];
				 query[thisItem].push(thisOption);
			}
		}
	});
	return query;
}
function returnSelectedData(inOrOut,query,dataArray){
	//inOrOut is currently not used
	if (Object.objSize(query) === 0 ) return [];
	var select = dataArray;
	for (var key in query){
		//exclude continuum variables such as assignment
		if ( key === 'Assignment') continue;
		//Sections, the way registrar has them are problematic since they are not biunivocal
		//Multiple selection will imply "or" instead of "and"
		if ( key === 'Section'){
			var tempoArray = [];
			for (var i=0; i< select.length; i++){
				var found = false;
				for (var j=0; j<query[key].length; j++){
					if ( select[i][key] == query[key][j] ) found = true;
				}
				if (found) tempoArray.push(select[i]);
			}
			select = tempoArray;
		}else{
			//categories other than seciton will be "and"
			var tempoArray = [];
			for (var i=0; i< select.length; i++){
				var found = false;
				for (var j=0; j<query[key].length; j++){
					if ( select[i][key] == query[key][j] ) found = true;
				}
				if (found) tempoArray.push(select[i]);
			}
			select = tempoArray;
		}
	}
	return select;
}
function returnFilteredCategoryData(filterQuery,selectArray){
	if (Object.objSize(filterQuery) === 0 ) return selectArray;	
	var tempoBackgroundsJson = studentBackgroundsJson;
	for (var key in filterQuery){
		for (var i=0; i<filterQuery[key].length; i++){
			var thisValue = filterQuery[key][i];
			tempoBackgroundsJson = $.grep(tempoBackgroundsJson,function(v,j){
				return v[key] !==  thisValue;
			})
		}
	}
	var tempoArray = [];
	for (var i=0; i<tempoBackgroundsJson.length; i++){
		var thisRecord = $.grep(selectArray,function(v,j){
			return v.StudentId === tempoBackgroundsJson[i]["StudentId"];
		});
		if (thisRecord.length === 1) tempoArray.push(thisRecord[0]);
	}
	return tempoArray;
}
function getFilterNumberRange(axis){
	var low = $("#filterNumLow"+axis).val();
	var high = $("#filterNumHigh"+axis).val();
	var inOrOut = $("input:radio[name=filterInOut"+axis+"]:checked").val();
	if ( $.isNumeric(low) && $.isNumeric(high)){
		var filterRange = [parseFloat(low),parseFloat(high)];
	}else{
		var filterRange = [-1,9999];
	}
	return [inOrOut,filterRange];
}
function returnFilteredNumberData(axis,filterQuery,selectArray){
	if (Object.objSize(filterQuery) === 0 ) return selectArray;	
	var inOrOut = getFilterNumberRange(axis)[0];
	var filterRange = getFilterNumberRange(axis)[1];
	//tempoGrades is the selected group of studentGrades to be filtered
	//selectArray may not contain grades (if otherScores are used for example)
	var tempoGrades = studentGradesJson;
	for (var key in filterQuery){
		if ( key === 'Assignment') continue;
		var tempoArray = []
		for (var i=0; i< tempoGrades.length; i++){
			var found = false;
			for (var j=0; j<filterQuery[key].length; j++){
				if ( tempoGrades[i][key] == filterQuery[key][j] ) found = true;
			}
			if (found) tempoArray.push(tempoGrades[i]);
		}
		tempoGrades = tempoArray;		
	}
	//What if GPA/ACT is selected to be filtered?
	if (axis === 'X') var axisB = 'P';
	if (axis === 'Y') var axisB = 'Q';
	var otherScores = $("#cvcOtherScores"+axisB+" option:selected");
	if (otherScores.val() !== 'none' ){
		filterQuery['Assignment'] = [];
		filterQuery['Assignment'].push(otherScores.val());
		var newTempoGrades = [];
		for (var i=0; i<tempoGrades.length; i++){
			var thisStudent = tempoGrades[i]["StudentId"];
			thisRecord = $.grep(studentBackgroundsJson,function(v,j){
				return v["StudentId"] === thisStudent && v[filterQuery['Assignment'][0]] >= filterRange[0] && v[filterQuery['Assignment'][0]] <= filterRange[1];
			})	
			if (thisRecord.length === 1) newTempoGrades.push(thisRecord[0]);
		} 
		tempoGrades = newTempoGrades;
	}else{
		if (filterQuery['Assignment'].length > 1) alert("BoSCO is not ready for multiple assignments, yet");
		tempoGrades = $.grep(tempoGrades,function(v,i){
			return v[filterQuery['Assignment'][0]] >= filterRange[0] && v[filterQuery['Assignment'][0]] <= filterRange[1];
		});
	}

	//if include: tempoGrades are the ONLY students kept (provided they were selected in selectXX)
	//if exclude: tempoGrades are the students not to appear in selectXX
	//example: selectArray [1,2,3,4,5]; filterQuery [3,5,7]
	//if exclude: tempoArray [1,2,4] if include:[3,5]
	var tempoArray = [];
	for (var i=0; i<selectArray.length; i++){
		//is this student in selectArray
		var thisStudentId = selectArray[i]["StudentId"];
		var found = false;
		for (var j=0; j<tempoGrades.length; j++){
			if ( tempoGrades[j]["StudentId"] === thisStudentId ){
				if (inOrOut === 'include') tempoArray.push(selectArray[i]);
				found = true;
			}
		}
		if (inOrOut === 'exclude' && ! found) tempoArray.push(selectArray[i]);
	}

	return tempoArray;
}
function returnSelectedBackgroundData(selectedItem,selectArray){
	var otherScores = selectedItem;
	if (otherScores.val() === 'none') return selectArray;
	var tempoArray = [];
	for (var i=0; i<selectArray.length; i++){
		var thisStudentId = selectArray[i]["StudentId"];
		var studentBackground = $.grep(studentBackgroundsJson,function(v,j){
			return v.StudentId === thisStudentId;
		});
		tempoArray.push(studentBackground[0]);
	};
	return tempoArray;
}
function returnSelection(){
	//-->Build xQuery and yQuery: the selection in x and yMenus
	var xQuery = returnMenuSelection( $(".xMenu") );
	var yQuery = returnMenuSelection( $(".yMenu") );
	//--> Build selectXX and selectYY the selected student data
	var selectXX = returnSelectedData('in',xQuery,studentGradesJson);
	var selectYY = returnSelectedData('in',yQuery,studentGradesJson);
	//-->Modify selectXX and selectYY if otherScores are selected 
	var otherScores = $("#cvcOtherScoresX option:selected");
	if (otherScores.val() !== 'none' && Object.objSize(xQuery) > 0){
		xQuery['Assignment'][0] = otherScores.val();
		selectXX = returnSelectedBackgroundData(otherScores,selectXX)
	}
	var otherScores = $("#cvcOtherScoresY option:selected");
	if (otherScores.val() !== 'none' && Object.objSize(yQuery) > 0){
		yQuery['Assignment'][0] = otherScores.val();
		selectYY = returnSelectedBackgroundData(otherScores,selectYY)
	}
	//-->Build the xFilterBack and yFilterBack filter arrays
	var xFilterBack = returnBoxSelection( $(".filterCategoryVariablesX"));
	var yFilterBack = returnBoxSelection( $(".filterCategoryVariablesY"));
	//--> Filter selectXX and selectYY according to xFilterBack and yFilterBack
	selectXX = returnFilteredCategoryData(xFilterBack,selectXX)
	//console.log(xFilterBack);
	selectYY = returnFilteredCategoryData(yFilterBack,selectYY)

	//-->Create xFilterGrade and yFilterGrade
	xFilterGrade = [];
	yFilterGrade = [];
	if ( $("#filterNumericalVariablesX").is(":checked")){
		var xFilterGrade = returnMenuSelection( $(".pMenu") );
		//--> Filter selectXX and selectYY according to xFilterGrade and yFilterGrade
		selectXX = returnFilteredNumberData('X',xFilterGrade,selectXX);
	}
	if ( $("#filterNumericalVariablesY").is(":checked")){
		var yFilterGrade = returnMenuSelection( $(".qMenu") );
		//--> Filter selectXX and selectYY according to xFilterGrade and yFilterGrade
		selectYY = returnFilteredNumberData('Y',yFilterGrade,selectYY);
	}

	var pairedData = [];
	var pairedStudents = [];
	for (var i=0; i<selectXX.length; i++){
		var studentX = selectXX[i].StudentId;
		for (var j=0; j< selectYY.length; j++){
			if (studentX == selectYY[j].StudentId ){
				pairedData.push([selectXX[i][xQuery["Assignment"][0]],selectYY[j][yQuery["Assignment"][0]]]);
				pairedStudents.push(studentX);
			} 
		}
	}
	var unpairedData = [];
	var unpairedStudents = [];
	if (Object.objSize(xQuery) > 0 && Object.objSize(yQuery) > 0){
		for (var i=0; i<Math.max(selectXX.length,selectYY.length); i++){
			if (i>selectXX.length-1){
				unpairedData.push(    ["",selectYY[i][ yQuery["Assignment"][0]]]);
				unpairedStudents.push(["",selectYY[i].StudentId]);
			}else if (i>selectYY.length-1){
				unpairedData.push([selectXX[i][ xQuery["Assignment"][0]],""]);
				unpairedStudents.push([selectXX[i].StudentId,""]);
			}else{
				unpairedData.push(    [selectXX[i][ xQuery["Assignment"][0]],selectYY[i][ yQuery["Assignment"][0]]]);
				unpairedStudents.push([selectXX[i].StudentId,             selectYY[i].StudentId]);
			}
		}
	}else if (Object.objSize(xQuery) > 0){
		for (var i=0; i<selectXX.length; i++){
			unpairedData.push([selectXX[i][ xQuery["Assignment"][0]],""]);
			unpairedStudents.push([selectXX[i].StudentId,""]);
		}
	}else if (Object.objSize(yQuery) > 0){
		for (var i=0; i<selectYY.length; i++){
			unpairedData.push(    ["",selectYY[i][ yQuery["Assignment"][0]]]);
			unpairedStudents.push(["",selectYY[i].StudentId]);
		}
	}
	return [pairedData,pairedStudents,unpairedData,unpairedStudents,[xQuery,yQuery,xFilterBack,yFilterBack,xFilterGrade,yFilterGrade]]
}
function showStudentProfile(item,dataArray,thisId) {
	var valueX = item.datapoint[0];
	var valueY = item.datapoint[1];
	var x = item.pageX;
	var y = item.pageY;
	
	var thisIndex = item.dataIndex;
	var thisStudentId = dataArray[1][thisIndex];
	var chosenStudent = $.grep(studentBackgroundsJson, function (v,i) {
		return v.StudentId === thisStudentId;
	})
	//choose the student profile corresponsing the semester of this given grade or the latest?
	//In a scatter plot there are two, so you cannot give both, give the latest on the record
	var contents = "<ul><li>point: ("+valueX+","+valueY+")</li><li>Most recent student data:</li>";
	for (var key in chosenStudent[0]){
		contents += "<li>"+key+": "+chosenStudent[0][key]+"</li>";
	}
	contents += "</ul>";
	$('<div class="'+thisId+'">' + contents + '</div>').css( {
	//$('<div class="'+thisId+'">' + contents + '</div>').css( {
		position: 'absolute',
		display: 'block',
		top: y + 5,
		left: x + 5,
		border: '1px solid #fdd',
		padding: '2px',
		'background-color': '#fee',
		opacity: 0.80
	}).appendTo("body").fadeIn(200);
}
function downloadSelection(){
	var dataMatch = returnSelection();
	var pairedData = dataMatch[0];
	var pairedStudents = dataMatch[1];
	var unpairedData = dataMatch[2];
	var unpairedStudents = dataMatch[3];
	var query = dataMatch[4];
	var csvContent = "data:text/csv;charset=utf-8,\n";
	csvContent += "StudentId X, Query X: '"+JSON.stringify(query[0])+JSON.stringify(query[2])+"'";
	csvContent += ",";
	csvContent += "StudentId Y, Query Y: '"+JSON.stringify(query[1])+JSON.stringify(query[3])+"'";
	csvContent += "\n";
	for (var i=0; i< unpairedStudents.length; i++){
		csvContent += unpairedStudents[i][0]+",";
		csvContent += unpairedData[i][0]+",";
		csvContent += unpairedStudents[i][1]+",";
		csvContent += unpairedData[i][1];
		csvContent += "\n";
	}
	var encodedUri = encodeURI(csvContent);
	//only chrome allows download attribute
	//var link = document.createElement("a");
	//link.setAttribute("href", encodedUri);
	//link.setAttribute("download", "bosco_data.csv");
	//link.click();
	window.open(encodedUri);
}
function buildHistogram(myArray,nbins,binSize){
	//var minValue = Math.min.apply( Math, myArray );
	var minValue = 0;
	var myData = [];
	for (var i=0; i<nbins+1; i++){
		myData.push(0);
	}
	for (var i=0; i<myArray.length; i++){
		var div = Math.floor(myArray[i]/binSize);
		myData[div] += 1;
	}
	var myFreq = [];
	for (var i=0; i<myData.length; i++){
		myFreq.push([i*binSize,myData[i]]);
	}
	return myFreq;
}
function writeGraphHeader(labelArray){
	var thisLabel = "";
	//it must have at least a course and an assignment
	var xQuery = labelArray[0];
	var yQuery = labelArray[1];
	var xFilterBack = labelArray[2];
	var yFilterBack = labelArray[3];
	var xFilterGrade = labelArray[4];
	var yFilterGrade = labelArray[5];

	if (Object.objSize(xQuery) > 0 ){
		thisLabel += "<b>X</b>: ";
		for (var key in xQuery){
			thisLabel += key+" : ["+xQuery[key].join(",")+"]; ";
		}
		if (Object.objSize(xFilterBack) > 0 ){
			thisLabel += "<b>Excluding</b>:"
			for (var key in xFilterBack){
				thisLabel += key+" : ["+xFilterBack[key].join(",")+"];";
			}
		}
		if (Object.objSize(xFilterGrade) > 0 ){
			var inOrOut = getFilterNumberRange('X')[0];
			var filterRange = getFilterNumberRange('X')[1];
			thisLabel += "<b>"+inOrOut+" range ("+filterRange.join(":")+"):</b>";
			for (var key in xFilterGrade){
				thisLabel += key+" : ["+xFilterGrade[key].join(",")+"];";
			}
		}
	}
	if (Object.objSize(yQuery) > 0 ){
		thisLabel += "<br><b>Y</b>: ";
		for (var key in yQuery){
			thisLabel += key+" : ["+yQuery[key].join(",")+"]; ";
		}
		if (Object.objSize(yFilterBack) > 0 ){
			thisLabel += "<b>Excluding</b>:"
			for (var key in yFilterBack){
				thisLabel += key+" : ["+yFilterBack[key].join(",")+"];";
			}
		}
		if (Object.objSize(yFilterGrade) > 0 ){
			var inOrOut = getFilterNumberRange('Y')[0];
			var filterRange = getFilterNumberRange('Y')[1];
			thisLabel += "<b>"+inOrOut+" range ("+filterRange.join(":")+"):</b>";
			for (var key in yFilterGrade){
				thisLabel += key+" : ["+yFilterGrade[key].join(",")+"];";
			}
		}
	}
	$("#graphTitle").append('<div style="position:relative;border: 1px solid;left:0px;top:0px;color:#666;font-size:small">'+thisLabel+'</div>');
}
function plotCVC(){

	$("#placeholder").empty();
	$("#graphTitle").empty();
	//check what type of graph is selected
	$("#selectGraphType").css("visibility", "visible");
	var graphType = $('input[name=selectGraphType]:checked','#selectGraphType').attr('id');
	if ( graphType == 'barGraphButton') plotCVCbar();
	if ( graphType == 'scatterPlotButton') plotCVCscatter();
	if ( graphType == 'matrixButton') plotCVCmatrix();
	if ( graphType == 'timelineButton') plotCVCtimeline();
}
function plotCVCbar(){
	var dataMatch = returnSelection();
	var pairedData = dataMatch[0];
	var unpairedData = dataMatch[2];
	var labelArray = dataMatch[4];
	var d1X = [];
	var d1Y = [];
	for (var i=0; i<unpairedData.length; i++){
		if ( unpairedData[i][0] !== "" ) d1X.push(unpairedData[i][0]);
		if ( unpairedData[i][1] !== "" ) d1Y.push(unpairedData[i][1]);
	}

	//$("#graphTitle").empty();
	if ( d1X.length > 0 && d1Y.length > 0 && pairedData.length === 0 ) {
		var msg = "The X selection has no common students with the Y selection.";
		$("#graphTitle").append('<div id="XYmsg" style="position:relative;border: 1px solid;left:0px;top:0px;color:#666;font-size:small">'+msg+'</div>');
	}
	if ( d1X.length > 0 && d1Y.length > 0 && pairedData.length > 0 ) {
		var msg = 'The X selection has common students with the Y selection. Check the scattered plot';
		$("#graphTitle").append('<div id="XYmsg" style="position:relative;border: 1px solid;left:0px;top:0px;color:#666;font-size:small">'+msg+'</div>');
		//$("#plotScattered").click(function(){plotCVCscatter();})
		/*
		var msg2 = 'Show a matrix of correlation coefficients among different assignments.<br> <button id="plotMatrix">Click here</button>';
		$("#graphTitle").append('<div id="XYmsg2" style="position:relative;border: 1px solid;left:0px;top:0px;color:#666;font-size:larger">'+msg2+'</div>');
		$("#plotMatrix").click(function(){plotMatrixCVC();})
		*/
	}
	writeGraphHeader(labelArray);
	//if no data --> nothing to plot here
	if (unpairedData.length<1) return;
	
	var data = [];
	var nbins = 20;
	//draw two y-axes http://www.jqueryflottutorial.com/how-to-make-jquery-flot-multiple-axes-chart.html
	//Check if we should normalize 
	//if ($('#normalizeData').is(':checked')){}
	if (d1X.length > 0){
		//build the histogram
		var binSize = Math.max.apply(Math,d1X)/nbins;
		//is this a 100-course
		if (binSize>3 && binSize<7) binSize = 5;
		var myFreqX = buildHistogram(d1X,nbins,binSize);
		data.push({data:myFreqX,label:'X',color:"red",bars:{show:true, barWidth:binSize}});
	}
	if (d1Y.length > 0){
		var binSize = Math.max.apply(Math,d1Y)/nbins;
		if (binSize>3 && binSize<7) binSize = 5;
		var myFreqY = buildHistogram(d1Y,nbins,binSize);
		data.push({data:myFreqY,label:'Y',color:"blue",bars:{show:true, barWidth:binSize}});
	}
	var options = { 
		//bars:  {show:true, barWidth:5},
		//xaxis: {show:true, autoscaleMargin: 0.05, zoomRange: [0.1, 100], panRange: [0, 100] },
		//yaxis: {           autoscaleMargin: 0.05, zoomRange: [0.1, 100], panRange: [0, 100] },
		xaxis: {show:true, autoscaleMargin: 0.05},
		yaxis: {           autoscaleMargin: 0.05},
		grid:  {hoverable: true, clickable: true }
	}
	var plot = $.plot("#placeholder", data, options);

}
function buildCourseMatrix(curriculumArray,statObs){
	var myCourses = [];
	for (var i=0; i< curriculumArray.length; i++){
		var thisCourse = curriculumArray[i]
		if ($.inArray(thisCourse[0],myCourses) == -1 ) myCourses.push(thisCourse[0]);
	}
	var xQuery = [];
	var yQuery = [];
	xQuery['Assignment'] = [];
	xQuery['Assignment'].push('Total Grade');
	yQuery['Assignment'] = [];
	yQuery['Assignment'].push('Total Grade');
	var curriculumArray = [];
	//correlation between courses
	var courseCorrelation = [];
	for (var i=0; i<myCourses.length; i++){
		var courseX = myCourses[i];
		xQuery['Course'] = [];
		xQuery['Course'].push(courseX);
		var thisRow = []
		for (var j=0; j<myCourses.length; j++){
			var courseY = myCourses[j];
			yQuery['Course'] = [];
			yQuery['Course'].push(courseY);
			thisRow.push(getCorrelation(xQuery,yQuery,statObs));
		}
		courseCorrelation.push(thisRow);
	}
	return [courseCorrelation,myCourses];
}
function buildSemesterMatrix(curriculumArray,statObs){
	var xQuery = [];
	var yQuery = [];
	xQuery['Assignment'] = [];
	xQuery['Assignment'].push('Total Grade');
	yQuery['Assignment'] = [];
	yQuery['Assignment'].push('Total Grade');
	//correlation between semesters
	var mySemesters = [];
	var semesterCorrelation = [];
	for (var i=0; i<curriculumArray.length; i++){
		var thisCourseY = curriculumArray[i];
		var courseX = thisCourseY[0];
		var semesterX = thisCourseY[1];
		mySemesters.push(courseX+";"+semesterX);
		//var assignmentsArrayX = thisCourse[2];
		xQuery['Course'] = [];
		xQuery['Course'].push(courseX);
		xQuery['Semester'] = [];
		xQuery['Semester'].push(semesterX);
		var thisRow = [];
		for (var j=0; j<curriculumArray.length; j++){
			var thisCourseY = curriculumArray[j];
			var courseY = thisCourseY[0];
			var semesterY = thisCourseY[1];
			yQuery['Course'] = [];
			yQuery['Course'].push(courseY);
			yQuery['Semester'] = [];
			yQuery['Semester'].push(semesterY);
			thisRow.push(getCorrelation(xQuery,yQuery,statObs));
		}
		semesterCorrelation.push(thisRow);
	}
	return [semesterCorrelation,mySemesters];
}
function buildAssignmentMatrix(curriculumArray,statObs){
	//check if it has been created. If not, compute it and send it to the server.
	var xQuery = [];
	var yQuery = [];
	var myAssignments = [];
	var prevCourseX = "";
	var prevSemesterX = "";
	//correlation between assignments
	var assignmentCorrelation = [];
	for (var i=0; i<curriculumArray.length; i++){
		var thisCourseX = curriculumArray[i];
		var courseX = thisCourseX[0];
		var semesterX = thisCourseX[1];
		var assignmentsArrayX = thisCourseX[2];
		xQuery['Course'] = [];
		xQuery['Course'].push(courseX);
		xQuery['Semester'] = [];
		xQuery['Semester'].push(semesterX);
		for (var k=0; k<assignmentsArrayX.length; k++){
			var thisRow = [];
			var assignmentX = assignmentsArrayX[k];
			if (assignmentX.indexOf("Category") === -1 ) continue;
			xQuery['Assignment'] = [];
			xQuery['Assignment'].push(assignmentX);
			
			for (var j=0; j<curriculumArray.length; j++){
				var thisCourseY = curriculumArray[j];
				var courseY = thisCourseY[0];
				var semesterY = thisCourseY[1];
				var assignmentsArrayY = thisCourseY[2];
				yQuery['Course'] = [];
				yQuery['Course'].push(courseY);
				yQuery['Semester'] = [];
				yQuery['Semester'].push(semesterY);
				for (var l=0; l<assignmentsArrayY.length; l++){
					var assignmentY = assignmentsArrayY[l];
					if (assignmentY.indexOf("Category") === -1 ) continue;
					yQuery['Assignment'] = [];
					yQuery['Assignment'].push(assignmentY);
					var r2 = getCorrelation(xQuery,yQuery,statObs);
					thisRow.push(r2);
				}
			}
			assignmentCorrelation.push(thisRow);
			//take care of headers
			if ( courseX == prevCourseX && semesterX == prevSemesterX ){
				assignIndex += 1 ;
			}else{
				assignIndex = 1;
				prevCourseX = courseX;
				prevSemesterX = semesterX;
			}
			//myAssignments.push(courseX+" "+semesterX+" "+assignIndex)
			myAssignments.push(courseX+";"+semesterX+";"+assignmentX.replace("Category:",""));
		}
	}
	return [assignmentCorrelation,myAssignments];
}
function doLeastSquare(data){
	var newData = []
	for (var i=0; i<data.length; i++){
		var pair = data[i];	
		if ( pair[0] != "" && pair[1] != "" ) newData.push(pair);
		//if ( ! isNaN(pair[0]) || isNaN(pair[1]) ) newData.push(pair);
	}
	var line = ss.linear_regression().data(newData).line();
	var r2 = ss.r_squared(newData,line);
	return [r2,line];
}
function getCorrelation(xQuery,yQuery,statObs){
	var selectXX = returnSelectedData('in',xQuery,studentGradesJson)
	var selectYY = returnSelectedData('in',yQuery,studentGradesJson)
	
	if (statObs == "meanDiff"){
		var dataX = [];
		for (var k=0; k<selectXX.length; k++){
			dataX.push(selectXX[k][xQuery["Assignment"][0]]);
		}
		var dataY = [];
		for (var k=0; k<selectYY.length; k++){
			dataY.push(selectYY[k][yQuery["Assignment"][0]]);
		}
		var results = Math.abs( ss.mean(dataX) - ss.mean(dataY) )
		return results;
	}
	var pairedData = [];
	for (var k=0; k<selectXX.length; k++){
		var studentX = selectXX[k].StudentId;
		for (var l=0; l< selectYY.length; l++){
			if (studentX == selectYY[l].StudentId ){
				var x = selectXX[k][xQuery["Assignment"][0]];
				var y = selectYY[l][yQuery["Assignment"][0]];
				pairedData.push([x,y]);
				//pairedStudents.push(studentX);
			} 
		}
	}
	//some students retake a course, just a few, creating a false positive for correlation, let's remove those cases
	if (pairedData.length >5){
		var corrResults = doLeastSquare(pairedData);
		var line = corrResults[1];
		var yIntercept = line(0);
		var slope = line(1) - yIntercept;
		if (statObs == "r2") var results = corrResults[0];
		if (statObs == "slope") var results = slope;
		if (statObs == "tTest") var results = corrResults[0];
	}else{
		var results = 0.0;
	}
	return results;
}
function plotCVCmatrix(){
	var dataMatch = returnSelection();
	var labelArray = dataMatch[4];
	var d1 = dataMatch[0];
	var xQuery = labelArray[0];
	var yQuery = labelArray[1];
	//if (Object.objSize(xQuery) == 0 || Object.objSize(yQuery) === 0 ){
	if (xQuery['Semester'] == undefined || yQuery["Semester"] == undefined ){
		var msg = "For a matrix, select two semesters for X and Y axis";
		$("#graphTitle").append('<div id="XYmsg" style="position:relative;border: 1px solid;left:0px;top:0px;color:#666;font-size:small">'+msg+'</div>')
		return
	}
	var matrix = buildCVCmatrix();
	var thisTable = plotd3svg(matrix[0],matrix[1],statObs);
	thisTable.style("font-size", "1px");
	thisTable.selectAll("td").on("click",function(){
		var row = $(this).closest('tr').children('td:nth-child(1)').text();
		var column = matrix[1][this.cellIndex];
		var query = window.location.search.substring(1);
		var myKey = query.split('=')[1];
		window.location.href = "bosco.php?key="+myKey+"&xquery="+row+"&yquery="+column;
	});
	thisTable.selectAll("td").on("mouseover", function(){
		var row = $(this).closest('tr').children('td:nth-child(1)').text();
		var column = matrix[1][this.cellIndex];
		var text = "<p>"+column+" vs "+row;
		$('<div class="cellPopUp">'+ text + '</div>').css({
			position: 'absolute',
			display: 'none',
			top: 5,
			right: 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80	
		}).appendTo("body").fadeIn(200);;
	});
	thisTable.selectAll("td").on("mouseout", function(){
		$(".cellPopUp").remove();
	});
	writeGraphHeader(labelArray);
}
function buildCVCmatrix(){
	
}
function plotCVCscatter(){
	var dataMatch = returnSelection();
	var labelArray = dataMatch[4];
	var d1 = dataMatch[0];
	if ( d1.length === 0 ){
		var xQuery = labelArray[0];
		var yQuery = labelArray[1];
		if (Object.objSize(xQuery) == 0 || Object.objSize(yQuery) === 0 ){
			var msg = "For a scatter plot, select two groups for X and Y axis";
		}else{
			var msg = "The X selection has no common students with the Y selection";
		}
		$("#graphTitle").append('<div id="XYmsg" style="position:relative;border: 1px solid;left:0px;top:0px;color:#666;font-size:small">'+msg+'</div>')
		return
	}
	var max = 0;
	var min = 100;

	for (var i=0; i<d1.length; i++){
		if (d1[i][0] > max) max = d1[i][0];
		if (d1[i][1] > max) max = d1[i][1];
		if (d1[i][0] < min) min = d1[i][0];
		if (d1[i][1] < min) min = d1[i][1];
	}
	var d2 = [[min,min],[max,max]];
	if ($('#diagonal').is(':checked')){
	var data = [{data:d1,label:'Y vs X',color:"red"},
	            {data:d2,lines: { show: true }}
	            ];
	}else{
	var data = [{data:d1,label:'Y vs X',color:"red"} ];
		
	}

	var plot = $.plot("#placeholder", data, { 
		points: {show:true},
		xaxis: {show:true, autoscaleMargin: 0.05 },
		yaxis: {            autoscaleMargin: 0.05 },
		grid: { hoverable: true, clickable: true }
	});
	//this should prevent the double-clicking phenomenon in plotclick
	//$('[class^="studentGrade"]').remove(); //not working :() maybe this http://jsfiddle.net/markcoleman/qw2v5/4/
	$("#placeholder").unbind("plotclick");
	//in case you forgot to remove the label, let's remove them when replotting
	$("#placeholder").bind("plotclick", function (event, pos, item) {
		//if the div does not exists: show it
		//I don't know how to toggle this frame
		if (item){
			var baba = item.datapoint[1].toString().replace(".","");
			var thisId = "StudentGrade"+baba;
			if ( $("."+thisId).length === 0 ) {
				showStudentProfile(item, dataMatch,thisId);
			}else{ 
				$("."+thisId).remove();
			}	
		}
	});
	//$("#graphTitle").empty();
	//var msg = 'The Scatter plot only shows paired data. <br> <button id="plotBarGraph">Click here</button> to show a bar graph with ALL data';
	//$("#graphTitle").html('<div style="position:relative;border: 1px solid;left:0px;top:0px;color:#666;font-size:larger">'+msg+'</div>');
	//$("#plotBarGraph").click(function(){plotCVC();})
	writeGraphHeader(labelArray);
}
function plotCVCtimeline(){
	
}
function populateSLICE(){
	//check if there's any course/semester checked'
	//var dataMatch = returnSelection();
	//get the Topics for the selected xQuery
	for (var i=0; i< questionMetadata.length; i++){
		
	}

}
function rebuildTable(curriculumArray){
	$("#upCenterDialog").empty();
	var val = $("#curriculumLevel input[name=curriculumLevel]:checked").val();
	var statObs = $("#statisticalOption input[name=curriculumStatistics]:checked").val();
	if (val == "Course") var matrix = buildCourseMatrix(curriculumArray,statObs);
	if (val == "Semester") var matrix = buildSemesterMatrix(curriculumArray,statObs);
	if (val == "Assignment"){
		//$("#loading").show();
		 var matrix = buildAssignmentMatrix(curriculumArray,statObs);
		//$("#loading").hide();
	}
	if (val == "Assignment"){
		var thisTable = plotd3svg(matrix[0],matrix[1],statObs);
	}else{
		var thisTable = plotd3Matrix2(matrix[0],matrix[1],statObs);
	}
	if (val == "Course"){
		//you should calculate this, based on the dimensions of the matrix
		 thisTable.style("font-size", "14px");
	}else if (val == "Semester"){
		 thisTable.style("font-size", "8px");
	}else if (val == "Assignment"){
		 thisTable.style("font-size", "1px");
	}
	thisTable.selectAll("td").on("click",function(){
		var row = $(this).closest('tr').children('td:nth-child(1)').text();
		var column = matrix[1][this.cellIndex];
		var query = window.location.search.substring(1);
		var myKey = query.split('=')[1];
		window.location.href = "bosco.php?key="+myKey+"&xquery="+encodeURIComponent(row)+"&yquery="+encodeURIComponent(column);
	});
	thisTable.selectAll("td").on("mouseover", function(){
		var row = $(this).closest('tr').children('td:nth-child(1)').text();
		var column = matrix[1][this.cellIndex];
		var text = "<p>"+column+" vs "+row;
		$('<div class="cellPopUp">'+ text + '</div>').css({
			position: 'absolute',
			display: 'none',
			top: 5,
			right: 5,
			border: '1px solid #fdd',
			padding: '2px',
			'background-color': '#fee',
			opacity: 0.80	
		}).appendTo("body").fadeIn(200);;
	});
	thisTable.selectAll("td").on("mouseout", function(){
		$(".cellPopUp").remove();
	});
	
}
// Create a function that returns a particular property of its parameter.
// If that property is a function, invoke it (and pass optional params).
/*
function f(name){ 
	var v,params=Array.prototype.slice.call(arguments,1);
	return function(o){
	return (typeof (v=o[name])==='function' ? v.apply(o,params) : v );
	};
}
*/
function plotd3svg(dataset,headers,statObs){
	//add the header also on the rows
	for (var i=0; i<dataset.length; i++){
		dataset[i].unshift(headers[i]);
	}
	headers.unshift("");
	var table = d3.select("#upCenterDialog").append("table"),
		thead = table.append("thead"),
		tbody = table.append("tbody");

	thead.append("tr")
		.selectAll("th")
		.data(headers)
		.enter()
		.append("th")
		.text(function(headers) { return headers; });
		
	// create a row for each object in the data
	var rows = tbody.selectAll("tr")
		.data(dataset)
		.enter()
		.append("tr");

	var td = rows.selectAll("td")
		.data(function(d) { return d; })
		.enter().append("td")
		.text(function(d) { 
			if (isNaN(d)){
				return d;
			}else{
				return "";
			} 
		});
	if (statObs == "slope"){
		td = rows.selectAll("td")
			.style('background',function(n){
				if ( n < 1){
					var rgb = Math.round(255*(1-n))
					return "rgb(255,"+rgb+","+rgb+")";
				}else{
					var rgb = Math.round(255*(n-1))
					return "rgb("+rgb+",255,"+rgb+")";
				}
			});
		
	}else{
		td = rows.selectAll("td")
			.style('background',function(n){
				var rgb = Math.round(255*(1-n))
				return "rgb(255,"+rgb+","+rgb+")";
			});
	}
	
	table.style("font-size", "1px");
	//if you return the table, then you can do things with it
	return table

}
function plotd3Matrix2(dataset,headers,statObs){
	//add the header also on the rows
	for (var i=0; i<dataset.length; i++){
		dataset[i].unshift(headers[i]);
	}
	headers.unshift("");
	var table = d3.select("#upCenterDialog").append("table"),
		thead = table.append("thead"),
		tbody = table.append("tbody");

	thead.append("tr")
		.selectAll("th")
		.data(headers)
		.enter()
		.append("th")
		.text(function(headers) { return headers; });
		
	// create a row for each object in the data
	var rows = tbody.selectAll("tr")
		.data(dataset)
		.enter()
		.append("tr");

	var td = rows.selectAll("td")
		.data(function(d) { return d; })
		.enter().append("td")
		.text(function(d) { 
			if (isNaN(d) || d == "" ){
				return d;
			}else{
				return d.toFixed(4);
			} 
			});
	if (statObs == "slope"){
		td = rows.selectAll("td")
			.style('background',function(n){
				if ( n < 1){
					var rgb = Math.round(255*(1-n))
					return "rgb(255,"+rgb+","+rgb+")";
				}else{
					var rgb = Math.round(255*(n-1))
					return "rgb("+rgb+",255,"+rgb+")";
				}
			});
		
	}else{
		td = rows.selectAll("td")
			.style('background',function(n){
				var rgb = Math.round(255*(1-n))
				return "rgb(255,"+rgb+","+rgb+")";
			});
	}
	//if you return the table, then you can do things with it
	return table

}
function plotd3Matrix(dataset,headers){
    //http://bl.ocks.org/mbostock/4063663
    //http://christopheviau.com/d3_tutorial/
    //http://phrogz.net/js/d3-playground/#ValueDeviation_Table
    //http://jsfiddle.net/7WQjr/
    //https://github.com/mbostock/d3/wiki/Selections#data
    d3.select("#upCenterDialog")
    .append("table")
    .style("border-collapse", "collapse")
    //.style("border", "2px black solid")
    
    .selectAll("tr")
    .data(dataset)
    .enter().append("tr")

    .selectAll("td")
    .data(function(d){return d;})
    .enter().append("td")
    //.style("border", "1px black solid")
    .style("padding", "10px")
    .on("mouseover", function(){d3.select(this).style("background-color", "aliceblue")}) 
    .on("mouseout", function(){d3.select(this).style("background-color", "white")}) 
    .text(function(d){return d;})
    .style("font-size", "8px");
}
function eraseStudentData(myKey){
	var answer = confirm("Are you sure you want to forget the current session in BoSCO?")
	if (answer){
		window.location.replace('eraseStudentData.php?key='+myKey);
	}else{
		alert("OK. Current session is still available");
	}
	
}
