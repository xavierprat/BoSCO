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
function parseThisCourseFile($line){
	$line2 = array();
	$i = 0;
	foreach ($line as $element) {
        if (is_numeric($element)) {
			$line2[] = floatval($element);
        } else {
        	#This should be temporary until all course descriptors are identical in all files
        	if ( $i == 0 ){
        		$shortCourse = explode(":",$element);
        		$line2[] = trim($shortCourse[0]);
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
$key = md5(microtime().rand());
#mkdir
$myDir = "./boscoupload/$key/";
mkdir($myDir);
#convert files into json
#store json files
#redirect to bosco page

// !empty( $_FILES ) is an extra safety precaution
// in case the form's enctype="multipart/form-data" attribute is missing
// or in case your form doesn't have any file field elements
$assignmentMatrix = array();
if( strtolower( $_SERVER[ 'REQUEST_METHOD' ] ) == 'post' && !empty( $_FILES ) )
{
	$jsonGrades = "";
	foreach( $_FILES[ 'gradesFile' ][ 'tmp_name' ] as $index => $tmpName )
	{
		if( !empty( $_FILES[ 'gradesFile' ][ 'error' ][ $index ] ) )
		{
            // some error occured with the file in index $index
            // yield an error here
			return false; // return false also immediately perhaps??
		}

        /*
            edit: the following is not necessary actually as it is now 
            defined in the foreach statement ($index => $tmpName)

            // extract the temporary location
            $tmpName = $_FILES[ 'image' ][ 'tmp_name' ][ $index ];
        */

		// check whether it's not empty, and whether it indeed is an uploaded file
		if( !empty( $tmpName ) && is_uploaded_file( $tmpName ) )
		{
			// the path to the actual uploaded file is in $_FILES[ 'image' ][ 'tmp_name' ][ $index ]
			// do something with it:
			$thisFileName = $myDir ."gradesFile". $index ;
			move_uploaded_file( $tmpName, $thisFileName .".csv" ); // move to new location perhaps?
			$gradesFileCSV = fopen($thisFileName .".csv","r");
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
        }
    }
	file_put_contents($myDir . "studentGradesJson.js","var studentGradesJson =".str_replace('][',',',$jsonGrades) );
	file_put_contents($myDir . "assignmentMatrix.js","var curriculumArray =".json_encode($assignmentMatrix) );
}

move_uploaded_file($_FILES["backgroundFile"]["tmp_name"], $myDir . "backgroundFile.csv");
move_uploaded_file($_FILES["courseFile"]["tmp_name"], $myDir . "courseFile.csv");

#backgroundFile
$backgroundFileCSV = fopen($myDir . "backgroundFile.csv","r");
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
$courseFileCSV = fopen($myDir . "courseFile.csv","r");
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
