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
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<!--script src="http://www.flotcharts.org/flot/jquery.flot.js"></script-->
	<!--
	<script src="../tools/flot/jquery.flot.js"></script>
	<script src="../tools/flot/jquery.flot.navigate.js"></script>
	-->
	<script src="http://d3js.org/d3.v2.min.js?2.8.1"></script>

	<!--script src="http://www.jstat.org/jstat-1.0.0.min.js"></script-->
	<!-- other statistical packages
		http://pseudosavant.com/blog/2013/06/14/psmathstats-2-0/
		http://macwright.org/simple-statistics/ -->
	<!--script src="http://bit.ly/ss-js"></script-->
	<script src="../tools/simple-statistics/src/simple_statistics.js"></script>
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
	<script type="text/javascript" src="jslib/cvtime.js"></script>
	
	<link type="text/css" rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/themes/eggplant/jquery-ui.min.css" />
	<link type="text/css" rel="stylesheet" href="main.css" />
	<link type="text/css" rel="stylesheet" href="cvtime.css" />
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
			$("#curriculumTab").click(function(){
				window.location.href ='curriculum.php?key=<?php echo $myKey;?>';
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
						<li><a href="#courseVtimePlot">Course vs Time</a></li>
						<li id="curriculumTab" ><a href="#curriculum">Curriculum</a></li>
					</ul>
					<div id="courseVcoursePlot"> </div>
					<div id="courseVtimePlot">
						<div id="timeVariable">
							<p>Variable to plot over time</p>
							<input type="radio" checked name="timeVariable" value="Course">Courses
							<input type="radio"         name="timeVariable" value="Semester">Semesters
						</div>
					</div>
					<div id="curriculum">
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
			  University of Minnesota Rochester, 2013
			  <br />This work is licensed under a 
			  <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.
		</div>
	</div>
</body>
</html>

