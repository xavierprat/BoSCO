/**
 * @author Xavier Prat-Resina
 */
$(function(){
	//check radio-button
	
	//rebuildTable(curriculumArray);
	//on change radio-button
	$("#curriculumLevel input, #statisticalOption input").change(function(){
		rebuildTable(curriculumArray);
	});
	//view-source:http://mbostock.github.io/d3/talk/20111116/iris-parallel.html
	//http://bl.ocks.org/jasondavies/1341281
	var semesters = getSemesters(curriculumArray);
	var courses = getCourses(curriculumArray);
	//data = [
	//student 1 ["90","82","32"]
	//            chem, ap, soc
	//]
	var m = [80, 160, 200, 160],
	w = 1280 - m[1] - m[3],
	h = 800 - m[0] - m[2];

	var x = d3.scale.ordinal().domain(semesters).rangePoints([0, w]);
	var y = {};

	var line = d3.svg.line(),
	axis = d3.svg.axis().orient("left"),
	foreground;

	var svg = d3.select("#upCenterDialog").append("svg:svg")
	.attr("width", w + m[1] + m[3])
	.attr("height", h + m[0] + m[2])
	.append("svg:g")
	.attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	
	//for each semester:
	for (var i=0; i< semesters.length; i++){
		thisSemester = semesters[i];
		y[thisSemester] = d3.scale.linear()
		.domain(d3.extent(flowers, function(p) { return p[thisSemester]; }))
		.range([h, 0]);
	}
});
function compare(a,b) {
  if (a.last_nom < b.last_nom)
     return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}

function getCourses(curriculumArray){
	return ["SOC1571","Chem2331","BIOL2331","Chem2333","BIOL2332"];
}
function getSemesters(curriculumArray){
	var semesters = [];
	for (var i=0; i<curriculumArray.length; i++){
		var thisSemester = curriculumArray[i][1];
		if ($.inArray(thisSemester,semesters) == -1 ) semesters.push(thisSemester);	
	}
	//now sort them by time
	var timeWise = [];
	//objs.sort(compare);
	return ["Fall 2010","Spring 2011","Fall 2011","Spring 2012","Fall 2012","Spring 2013","Fall 2013"];
}
