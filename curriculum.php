<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
   "http://www.w3.org/TR/html4/strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>BoSCO</title>
	<meta name="author" content="Xavier Prat-Resina" />
	<!-- Date: 2013-07-10 -->
	<script src="libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="libs/jquery-ui-1.11.4.custom/jquery-ui.min.js"></script>
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
?>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/coursesJson.js"></script>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/studentGradesJson.js"></script>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/studentBackgroundsJson.js"></script>
	<script type="text/javascript" src="boscoupload/<?php echo $myKey; ?>/assignmentMatrix.js"></script>
	<!-- BoSCO javascript libraries -->
	<script type="text/javascript" src="jslib/bosco.js"></script>
	<script type="text/javascript" src="jslib/curriculum.js"></script>
	
	<link type="text/css" rel="stylesheet" href="libs/jquery-ui-1.11.4.custom/jquery-ui.min.css" />
	<link type="text/css" rel="stylesheet" href="main.css" />
	<link type="text/css" rel="stylesheet" href="loading.css" />
	<script type="text/javascript">
		$(document).ready(function(){
			$("#menuHeader a").button();
			$("button").button();
			$("#plotType").tabs({active:1}); 
			$("#plotType").resizable();
			$("#backData").tabs();
			$("#filterData").tabs();
			$("#commonTagOption").tabs();
			$("#cvcTab").click(function(){
				window.location.href ='bosco.php?key=<?php echo $myKey;?>';
			});
			$("#cvTimeTab").click(function(){
				//window.location.href ='cvtime.php?key=<?php echo $myKey;?>';
				alert("Under construction");
			})
			 $("#slider").slider({
				min: 0, max: 100, step: 1, values: [10, 90],
				slide: function(event, ui) {
						for (var i = 0; i < ui.values.length; ++i) {
							$("input.sliderValue[data-index=" + i + "]").val(ui.values[i]);
							//check http://jsfiddle.net/FPCRb/
						}
					}
			});
		})
	</script>
</head>
<body>
<div id="loading">
            <img src="images/loading1.gif" alt="Loading" />
</div>
	<div id="container">
		<div id="headerBar">
			<div id="menuHeader">
				<a href="javascript:alert('not yet implented')">Log In/Out</a>
				<a href="tutorial.html">Tutorial</a>
				<a href="javascript:window.location.href ='interface.html';">Go back to Upload</a>
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
						<li id="cvcTab" ><a href="#courseVcoursePlot">Course vs Course</a></li>
						<!--li id="cvTimeTab"><a href="#courseVtimePlot">Course vs Time</a></li-->
						<li><a href="#curriculum">Curriculum</a></li>
					</ul>
					<div id="courseVcoursePlot"> </div>
					<!--div id="courseVtimePlot">Not yet implemented</div-->
					<div id="curriculum">
						<div id="curriculumLevel">
							<p>Curriculum level of analysis</p>
							<input type="radio" checked name="curriculumLevel" value="Course">Course
							<input type="radio"         name="curriculumLevel" value="Semester">Semester
							<input type="radio"         name="curriculumLevel" value="Assignment">Assignment
						</div>
						<div id="statisticalOption">
							<p>Statistical analysis</p>
							<br>Requires common students<br>
							<input type="radio" checked name="curriculumStatistics" value="r2">Pearson's r2
							<input type="radio"         name="curriculumStatistics" value="slope">Slope
							<br>Does not require common students<br>
							<input type="radio"         name="curriculumStatistics" value="meanDiff">Mean's difference
							<input type="radio"         name="curriculumStatistics" value="tTest">Student's t test
						</div>
						<div id="colorCode">
							<p>Color code</p>
								<input type="text" class="sliderValue" data-index="0" value="10" />
								<input type="text" class="sliderValue" data-index="1" value="90" />
								<br>
							<div id="slider"></div>
						</div>
						<div id="sortMatrix">
							<p>Sort columns</p>
							<input type="radio" checked name="sortColumns">Default
							<input type="radio"         name="sortColumns">Clusters
							<input type="radio"         name="sortColumns">Academic year
							<input type="radio"         name="sortColumns">Value
						</div>
					</div>
				</div>
			</div>
			<div id="CenterDialog">
				<div id="upCenterDialog">
				</div>
				<div id="downCenterDialog">
				</div>
			</div>
		</div>
		<div id="lowerDialog">
		</div>
		<div id="footer">
			<hr/>
			<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/80x15.png" /></a> 
			  Robert Dunbar, Molly Dingel and Xavier Prat-Resina. University of Minnesota Rochester, 2013-2015
			  <br />This work is licensed under a 
			  <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.
		</div>
	</div>
</body>
</html>

