<?php
function getAssignments($list){
	$notAssignments = array("Course","Semester","Section","IRB","Final letter","StudentId");
	$assignments = array();
	foreach ($list as $thisAssignment){
		$there = False;
		if (! in_array($thisAssignment,$notAssignments)){
			$assignments[] = $thisAssignment;
		}
	}
	return $assignments;
}
function getShortCourseName($longName){
	if (strpos($longName,':') !== false) {
		$list = explode(":",$longName);
		$shortName = trim($list[0]);
		return $shortName;
	}else{
		$list = explode(" ",$longName);
		$shortName =$list[0]." ".$list[1]; 
		return trim($shortName);
	}
}
function parseThisCourseFile($line){
	$line2 = array();
	$i = 0;
	foreach ($line as $element) {
        if (is_numeric($element)) {
			$line2[] = floatval($element);
        } else {
        	#This should be temporary until all course descriptors are identical in all files
        	if ( $i == 0 ){
        		$line2[] = getShortCourseName($element);
        	}else{
				$line2[] = trim($element);
        	}
        }
		$i = $i+1;
	}
	return $line2;
}
function floatThisArray($line,$gradeExists){
	$letterGrade = array( 
	"A" => "4.0",
	"A-" => "3.75",
	"B+" => "3.25",
	"B" =>  "3.00",
	"B-" => "2.75",
	"C+" => "2.25",
	"C" =>  "2.00",
	"C-" => "1.75",
	"D+" => "1.25",
	"D" =>  "1.00",
	"D-" => "0.75",
	"W" => "0",
	"F" => "0");
	$line2 = array();
	foreach ($line as $element) {
        if (is_numeric($element)) {
			$line2[] = floatval($element);
        } else {
        	if ( $gradeExists == 1 && array_key_exists(trim($element),$letterGrade) ){
				$line2[] = $letterGrade[trim($element)];
			}elseif ( $gradeExists == 1 && strpos($element,',') !== false&& strpos($element,'00') !== false){
        		$section = explode(",",$element);
				$line2[] = floatval($section[0]);
        	}else{
				$line2[] = trim($element);
        	}
        }
	}
	return $line2;
}

#excel will write different end of lines depending on the format
ini_set('auto_detect_line_endings', true);

//Some definitions tha tmay change if we change the uploading process

$zipFile = "zipFile"; //the name inthe POST form
$backFile = "Students_demographics_file.csv"; //decided in the iSEAL zip file
$courseFile = "Course_file.csv";

//Read the ZIP file, unzip it and put it in the private folder
if(isset($_FILES['zipFile'])) {
	$key = md5(microtime().rand());
	$myDir = "./boscoupload/$key/";
	mkdir($myDir);
	$filename = $_FILES[$zipFile]["name"];
	$source = $_FILES[$zipFile]["tmp_name"];
	$type = $_FILES[$zipFile]["type"];

	//is the file the right mime?
	$accepted_types = array('application/zip', 'application/x-zip-compressed', 'multipart/x-zip', 'application/x-compressed');
	foreach($accepted_types as $mime_type) {
		if($mime_type == $type) {
			$okay = true;
			break;
		} 
	}
	
	//is the file extension zip?
	$name = explode(".", $filename);
	$continue = strtolower($name[1]) == 'zip' ? true : false;

	if(!$continue) {
		$message = "The file you are trying to upload is not a .zip file. Please try again.";
	}

	//unzip it
	$target_path = $myDir.$filename;
	echo " $target_path -  $source";
	if(move_uploaded_file($source, $target_path)) {
		$zip = new ZipArchive();
		$x = $zip->open($target_path);
		if ($x === true) {
			$zip->extractTo($myDir);
			$zip->close();
	
			unlink($target_path);
		}
	} else {	
		$message = "There was a problem with the upload. Please try again.";
	}
}else{
	$message = "This page only works when another page posts a zip file to it";
}
if($message) {
	echo "<p>$message</p>";
	die();
	}
//Create an array of files for grades
//loop over all files and build gradeFiles
$gradeFiles = array();
foreach( glob($myDir.'/*.*') as $fileinfo) {
	echo " * $fileinfo</br>";
	if ( strpos($fileinfo,$courseFile) === false && strpos($fileinfo,$backFile) === false ) {
		array_push($gradeFiles,$fileinfo);
	}
}


$jsonGrades = "";
$assignmentMatrix = array();
//foreach( $_FILES[ 'gradesFile' ][ 'tmp_name' ] as $index => $tmpName )
foreach( $gradeFiles as $index => $tmpName )
{
	//$thisFileName = $myDir ."gradesFile". $index ;
	//move_uploaded_file( $tmpName, $thisFileName .".csv" ); // move to new location perhaps?
	$gradesFileCSV = fopen($tmpName,"r");
	$headers = fgetcsv($gradesFileCSV, 0, ',');
	$complete = array();

	while ($row = fgetcsv($gradesFileCSV, 0, ',')) {
		//convert floatable values
		$row = floatThisArray($row,1);
		$course = $row[0];
		$semester = $row[1];
		//sometimes excel saves csv with empty lines. Skip those
		if ( empty($row[0]) === false ){
			#error_log("XPR \n".sizeof($headers)."\n".sizeof($row));
			#error_log("XPR \n".implode("-",$headers)."\n".implode("-",$row));
			$complete[] = array_combine($headers, $row);
		}
	}
	fclose($gradesFileCSV);
	#Save for curriculum
	array_push( $assignmentMatrix, array($course,$semester,getAssignments($headers)) );
	$jsonGrades .= json_encode($complete);
	file_put_contents($myDir . "studentGradesJson.js","var studentGradesJson =".str_replace('][',',',$jsonGrades) );
	file_put_contents($myDir . "assignmentMatrix.js","var curriculumArray =".json_encode($assignmentMatrix) );
}

//move_uploaded_file($_FILES["backgroundFile"]["tmp_name"], $myDir . "backgroundFile.csv");
//move_uploaded_file($_FILES["courseFile"]["tmp_name"], $myDir . "courseFile.csv");

#backgroundFile
$backgroundFileCSV = fopen($myDir . $backFile,"r");
$headers = fgetcsv($backgroundFileCSV, 1024, ',');
$complete = array();

while ($row = fgetcsv($backgroundFileCSV, 1024, ',')) {
	$row = floatThisArray($row,0);
    $complete[] = array_combine($headers, $row);
}
fclose($backgroundFileCSV);
$jsonBackground = json_encode($complete);
file_put_contents($myDir . "studentBackgroundsJson.js","var studentBackgroundsJson =".$jsonBackground);

#courseFile
$courseFileCSV = fopen($myDir . $courseFile,"r");
$headers = fgetcsv($courseFileCSV, 1024, ',');
$complete = array();

#$complete[] = "var coursesJson = ";
while ($row = fgetcsv($courseFileCSV, 1024, ',')) {
	#for course names, just take the initial descriptor
	$row = ParseThisCourseFile($row);
	#is this the same course?
	$complete[] = array_combine($headers, $row);
}
fclose($courseFileCSV);
$jsonCourses = json_encode($complete);
file_put_contents($myDir . "coursesJson.js","var coursesJson = ".$jsonCourses);

header("Location: bosco.php?key=".$key);
die();
?>
