<html>
<body>
<?php
$myKey = $_GET["key"];
if ( $myKey == "" ){
	 
?>
	<h1>An internal error happened. Please, report it</h1>
<?php
}else{
	$dir = './boscoupload' . DIRECTORY_SEPARATOR . $myKey;
	$it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
	$files = new RecursiveIteratorIterator($it,
				 RecursiveIteratorIterator::CHILD_FIRST);
	foreach($files as $file) {
		if ($file->isDir()){
			rmdir($file->getRealPath());
		} else {
			unlink($file->getRealPath());
		}
	}
	rmdir($dir);
?>
	<h1>BoSCO has closed this session. To view your student data go to iSEAL and load the data into BoSCO again</h1>
<?php
}
?>
</body>	
</html>