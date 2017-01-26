<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
   "http://www.w3.org/TR/html4/strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>BoSCO</title>
	<meta name="author" content="Xavier Prat-Resina" />
	<!-- Date: 2013-07-10 -->
	<!--script src="../jquery/jquery-1.10.1.min.js"></script-->
	<!--script src="http://code.jquery.com/jquery-1.10.1.min.js"></script-->
	<!--script src="libs/jquery/1.10.2/jquery.min.js"></script-->
	<script src="libs/jquery/2.1.4/jquery-2.1.4.min.js"></script>
	<script src="libs/jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>
	<!--script src="http://www.flotcharts.org/flot/jquery.flot.js"></script-->
	<script src="libs/flot/jquery.flot.js"></script>
	<script src="libs/flot/jquery.flot.navigate.js"></script>
	<!--script src="http://d3js.org/d3.v2.min.js?2.8.1"></script-->
	<script src="libs/d3/d3-master/d3.min.js"></script>

	<!--script src="http://www.jstat.org/jstat-1.0.0.min.js"></script-->
	<!-- other statistical packages
		http://pseudosavant.com/blog/2013/06/14/psmathstats-2-0/
		http://macwright.org/simple-statistics/ -->
	<!--script src="http://bit.ly/ss-js"></script-->
	<script src="libs/simple-statistics/src/simple_statistics.js"></script>
	<!-- Submitted data -->
<?php
$myKey = $_GET["key"];
if ( $myKey == "" ){ $myKey = "samplejson";}
?>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/coursesJson.js"></script>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/studentGradesJson.js"></script>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/studentBackgroundsJson.js"></script>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/assignmentMatrix.js"></script>
	<!-- BoSCO javascript libraries -->
	<script type="text/javascript" src="jslib/bosco.js"></script>
	<script type="text/javascript" src="jslib/cvc.js"></script>
	
	<link type="text/css" rel="stylesheet" href="libs/jquery-ui-1.11.4.custom/jquery-ui.min.css" />
	<link type="text/css" rel="stylesheet" href="main.css" />
	<script type="text/javascript">
		$(document).ready(function(){
			$("#menuHeader a").button();
			$("button").button();
			$("#plotType").tabs({active:0}); 
			$("#plotType").css("min-height", "300px");
			$("#plotType").resizable();
			$("#backData").tabs();
			$("#filterData").tabs();
			$("#commonTagOption").tabs();
			$("#curriculumTab").click(function(){
				window.location.href ='curriculum.php?key=<?php echo $myKey;?>';
			})
			$("#cvTimeTab").click(function(){
				//window.location.href ='cvtime.php?key=<?php echo $myKey;?>';
				alert("Under construction");
			})
			$("#selectGraphType").buttonset();
			/* $("#cvcStatistics").accordion({
				active: true,
				collapsible: false
			});*/
			//$("#cvcStatistics").resizable();
			/*
			$("#uploadFiles").accordion({
				active: false,
				collapsible: true
			});
			*/
			if ( "<?php echo $myKey;?>" == "samplejson" )alert("FYI: This student data is fake.");
		})
	</script>
</head>
<body>
<!--[if IE]><script language="javascript" type="text/javascript" >alert("You are using Internet Explorer and this site may not fully work. Please, consider using another browser");</script><![endif]-->
	<div id="container">
		<div id="headerBar">
			<div id="menuHeader">
				<a href="javascript:eraseStudentData('<?php echo $myKey; ?>')">Log Out Session</a>
				<!--a href="tutorial.html">Tutorial</a-->
				<a href="javascript:window.location.href ='interface.html';">Manual Upload</a>
			</div>
			<div id="headerTitle">
				BoSCO
				<br>A Browser of Student and Course Objects
			</div>
		</div>
		<div id="content">
			<div id="LeftDialog">
				<h4>Browse</h4>
				<div id="plotType">
					<ul>
						<li><a href="#courseVcoursePlot">Course vs Course</a></li>
						<!--li id="cvTimeTab"><a href="#courseVtimePlot">Course vs Time</a></li-->
						<li id="curriculumTab"><a href="#curriculum">Curriculum</a></li>
					</ul>
					<div id="courseVcoursePlot">

						<div class="AxisSelect" ><b>X axis:</b><br>
							<div class="selectMenus">Course<br>
								<select class="xMenu" id="cvcMenuCourseX" size="4" ></select>			
							</div>
							<div class="selectMenus">Semester<br>
								<select class="xMenu" id="cvcMenuSemesterX" size="4"></select>			
							</div>
							<div class="selectMenus">Section<br>
								<select class="xMenu" id="cvcMenuSectionX" multiple="4"></select>			
							</div>
							<div class="selectMenus">Assignment<br>
								<select class="xMenu" id="cvcMenuAssignmentX" ></select>
							</div>
							<br>
							<div class="selectOtherMenus">Other Scores<br>
							<select id="cvcOtherScoresX" size="3">
								<option selected value="none" >None</option>
								<option value="Cumulative GPA">GPA</option>
								<option value="ACT-math">ACT-math</option>
								<option value="Total Credits">Total credits</option>
								<option value="Term Credits">Term credits</option>
							</select>
							</div>
						</div>
						<div><hr></div>
						<div class="AxisSelect" ><b>Y axis:</b><br>
							<div class="selectMenus">Course<br>
								<select class="yMenu" id="cvcMenuCourseY" size="4" ></select>			
							</div>
							<div class="selectMenus">Semester<br>
								<select class="yMenu" id="cvcMenuSemesterY" size="4"></select>			
							</div>
							<div class="selectMenus">Section<br>
								<select class="yMenu" id="cvcMenuSectionY" multiple="4"></select>			
							</div>
							<div class="selectMenus">Assignment<br>
								<select class="yMenu" id="cvcMenuAssignmentY" ></select>
							</div>
							<br>
							<div class="selectOtherMenus">Other Scores<br>
							<select id="cvcOtherScoresY" size="3">
								<option selected value="none" >None</option>
								<option value="Cumulative GPA">GPA</option>
								<option value="ACT-math">ACT-math</option>
								<option value="Total Credits">Total credits</option>
								<option value="Term Credits">Term credits</option>
							</select>
							</div>
						</div>
						<div><hr></div>
						<div id="cvcStatistics">
							<!--
							<h3>Statistics on the selection</h3>
							<div>
								<div id="statisticsOverallNumbers">
								</div>
								<div id="statisticsX">
									<h4>Grade Statistics of selection: X-axis</h4>
									<ul id="showStatisticsX">
								
									</ul>
								</div>
								<div id="statisticsY">
									<h4>Grade Statistics of selection: Y-axis</h4>
									<ul id="showStatisticsY">
								
									</ul>
								</div>
								<div id="statisticsXY">
									<h4>Grade Statistics of selection: XY (paired)</h4>
									<ul id="showStatisticsXYpaired">
								
									</ul>
									<h4>Grade Statistics of selection: XY (unpaired)</h4>
									<ul id="showStatisticsXYunpaired">
								
									</ul>
								</div>
							</div>
							-->
						</div>
						
					</div>
					<!--div id="courseVtimePlot">Not yet implemented</div-->
					<div id="curriculum"></div>
				</div>
			</div>
			<div id="CenterDialog">
				<div id="upCenterDialog">
					<div style="text-align:center;visibility:hidden;" id="selectGraphType">
						<input type="radio" id="barGraphButton" name="selectGraphType" checked><label for="barGraphButton">Bar graph</label>
						<input type="radio" id="scatterPlotButton" name="selectGraphType"><label for="scatterPlotButton">Scatter plot</label>
						<input type="radio" id="timelineButton" name="selectGraphType"><label for="timelineButton">Time line</label>
						<input type="radio" id="matrixButton" name="selectGraphType"><label for="matrixButton">Matrix</label>
					</div>
					<p style="text-align:center;" id="graphTitle">
					</p>
					<br>
					<div id="placeholder" style="width: 100%;height: 300px">
					
					</div>
					<button id="reset">Reset</button>
					<button id="downloadCSV">Download Selection</button>
					<div style="float:right;"><input type="checkbox" id="diagonal">Show diagonal</div>
					<!--div style="float:right;"><input type="checkbox" id="normalizeData">Normalize to <input type="text" size="3" value="100"></div-->
					<div id="optionGraphXY"></div>
				</div>
				<div id="downCenterDialog">
					<!--
					Common concepts and tags
					<div id="commonTagOption">
						<ul>
							<li><a href="#automaticSearchConcepts">Automatic search</a></li>
							<li><a href="#findConceptsFromTags">Tagged material</a></li>
						</ul>
						<div id="automaticSearchConcepts">
							<h4>Serendipitous integration points</h4>
							<p>Concepts in X-selection</p>
							<div id="tagAutomaticX"></div>
							<p>Concepts in Y-selection</p>
							<div id="tagAutomaticY"></div>
							<p>Find the common and most-frequent concepts between two learning objects</p>
							<div id="tagAutomaticXY"></div>
						</div>
						<div id="findConceptsFromTags">
							<h4>Tagged integration points</h4>
							<p>Concepts in X-selection</p>
							<div id="tagAutomaticX"></div>
							<p>Concepts in Y-selection</p>
							<p>Find the common and most-frequent concepts between two learning objects</p>							
						</div>
					</div>
					-->
					
				</div>
			</div>
			<div id="RightDialog">
				<h4>Filter data</h4>
				<div id="backData">
					<ul>
						<li><a href="#statisticsBackground">Background statistics</a></li>
						<li><a href="#filterData">Filter Selection</a></li>
					</ul>
					<div id="statisticsBackground">
						<p>Overall statistics</p>
						<ul id="statisticsOverallBackground">					
						</ul>
						<p>Statistics of selection: X-axis</p>
						<ul id="statisticsBackgroundX">					
						</ul>
						<p>Statistics of selection: Y-axis</p>
						<ul id="statisticsBackgroundY">					
						</ul>
						<p>Statistics of selection: XY-paired</p>
						<ul id="statisticsBackgroundXYpaired">					
						</ul>
					</div>
					<div id="filterData">
						<ul>
							<li><a href="#filterDataX">Filter X-axis</a></li>
							<li><a href="#filterDataY">Filter Y-axis</a></li>
						</ul>
						<div id="filterDataX">
							<p>Category variables: Uncheck the boxes you want to filter out
							<br>Sex: 
								<input checked value="SexM" type="checkbox" class="filterCategoryVariablesX" />M
								<input checked value="SexF" type="checkbox" class="filterCategoryVariablesX" />F
							<br>Ethnicity/Race:
								<input checked value="RaceW" type="checkbox" class="filterCategoryVariablesX" />White
								<input checked value="RaceB" type="checkbox" class="filterCategoryVariablesX" />Black
								<input checked value="RaceA" type="checkbox" class="filterCategoryVariablesX" />Asian
								<input checked value="RaceH" type="checkbox" class="filterCategoryVariablesX" />Hispanic
								<input checked value="RaceI" type="checkbox" class="filterCategoryVariablesX" />Am. Indian
							<!--
							<br>First generation: 
								<input checked value="FirstGenerationY" type="checkbox" class="filterCategoryVariablesX" />Yes 
								<input checked value="FirstGenerationN" type="checkbox" class="filterCategoryVariablesX" />No
							-->
							</p>
							<div class="AxisSelect" >
								<input type="checkbox" id="filterNumericalVariablesX"/>Filter by grade
								<br><input type="radio" name="filterInOutX" checked value="exclude"/>Exclude
								<input type="radio" name="filterInOutX" value="include"/>Include
								<p class="selectOtherMenus">Low : <input type="text" id="filterNumLowX" size="3" /> - <input type="text" id="filterNumHighX"size="3" />: High</p> 
								<div class="selectMenus">Course<br>
									<select class="pMenu" id="cvcMenuCourseP" size="4" ></select>			
								</div>
								<div class="selectMenus">Semester<br>
									<select class="pMenu" id="cvcMenuSemesterP" size="4"></select>			
								</div>
								<div class="selectMenus">Section<br>
									<select class="pMenu" id="cvcMenuSectionP" multiple="4"></select>			
								</div>
								<div class="selectMenus">Assignment<br>
									<select class="pMenu" id="cvcMenuAssignmentP" ></select>
								</div>
								<!--div class="selectMenus">Question<br>
									<select class="pMenu" id="cvcMenuQuestionP" multiple="4"></select>		
								</div-->
								<br>
								<div class="selectOtherMenus">Other Scores<br>
									<select id="cvcOtherScoresP" size="3">
										<option selected value="none" >None</option>
										<option value="Cumulative GPA">GPA</option>
										<option value="ACT-math">ACT-math</option>
										<option value="Total Credits">Total credits</option>
										<option value="Term Credits">Term credits</option>
									</select>
								</div>
							</div>
							<p><button id="filterButtonX">Filter X</button>
							</p>
						</div>
						<div id="filterDataY">
							<p>Category variables: Uncheck the boxes you want to filter out
							<br>Sex: 
								<input checked value="SexM" type="checkbox" class="filterCategoryVariablesY" />M
								<input checked value="SexF" type="checkbox" class="filterCategoryVariablesY" />F
							<br>Ethnicity/Race:
								<input checked value="RaceW" type="checkbox" class="filterCategoryVariablesY" />White
								<input checked value="RaceB" type="checkbox" class="filterCategoryVariablesY" />Black
								<input checked value="RaceA" type="checkbox" class="filterCategoryVariablesY" />Asian
								<input checked value="RaceH" type="checkbox" class="filterCategoryVariablesY" />Hispanic
								<input checked value="RaceI" type="checkbox" class="filterCategoryVariablesY" />Am-Indian
							<!--
							<br>First generation: 
								<input checked value="FirstGenerationY" type="checkbox" class="filterCategoryVariablesY" />Yes 
								<input checked value="FirstGenerationN" type="checkbox" class="filterCategoryVariablesY" />No
							-->
							</p>
							<div class="AxisSelect" >
								<input type="checkbox" id="filterNumericalVariablesY"/>Filter by grade
								<br><input type="radio" name="filterInOutY" checked value="exclude"/>Exclude
								<input type="radio" name="filterInOutY" value="include"/>Include
								<p class="selectOtherMenus">Low : <input type="text" id="filterNumLowY" size="3" /> - <input type="text" id="filterNumHighY"size="3" />: High</p> 
								<div class="selectMenus">Course<br>
									<select class="qMenu" id="cvcMenuCourseQ" size="4" ></select>			
								</div>
								<div class="selectMenus">Semester<br>
									<select class="qMenu" id="cvcMenuSemesterQ" size="4"></select>			
								</div>
								<div class="selectMenus">Section<br>
									<select class="qMenu" id="cvcMenuSectionQ" multiple="4"></select>			
								</div>
								<div class="selectMenus">Assignment<br>
									<select class="qMenu" id="cvcMenuAssignmentQ" ></select>
								</div>
								<!--div class="selectMenus">Question<br>
									<select class="qMenu" id="cvcMenuQuestionQ" multiple="4"></select>		
								</div-->
								<br>
								<div class="selectOtherMenus">Other Scores<br>
									<select id="cvcOtherScoresQ" size="3">
										<option selected value="none" >None</option>
										<option value="Cumulative GPA">GPA</option>
										<option value="ACT-math">ACT-math</option>
										<option value="Total Credits">Total credits</option>
										<option value="Term Credits">Term credits</option>
									</select>
								</div>
							</div>
							<p><button id="filterButtonY">Filter Y</button> </p>
						</div>
						<p><button id="resetFilter">Reset</button></p>
					</div>
				</div>
				
			</div>
		</div>
		<div id="lowerDialog">
			<!--
			<div id="uploadFiles">
				<h3>Upload files</h3>
				<div>
					<form method='POST' enctype='multipart/form-data' action='processUpload.php'>
						Grades csv file: <input type=file name=gradesCSV> <a href="">Sample file</a><br>
						Courses csv file: <input type=file name=coursesCSV> <a href="">Sample file</a><br>
						Student background csv file: <input type=file name=backgroundCSV><a href="">Sample file</a><br>
						Assignments csv file: <input type=file name=assignmentsCSV><a href="">Sample file</a><br>
						Tags csv file: <input type=file name=tagsCSV><a href="">Sample file</a><br>
						<input type="submit"/>
					</form>		
				</div>
			</div>
			-->
		</div>
		<div id="footer">
			<br>
			<hr>
			<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/80x15.png" /></a> 
			  Robert Dunbar, Molly Dingel and Xavier Prat-Resina. University of Minnesota Rochester, 2013-2015
			  <br />This work is licensed under a 
			  <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.
		</div>
	</div>
</body>
</html>

