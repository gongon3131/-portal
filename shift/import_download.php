<?php

//ファイル名取得
$file_name = $_REQUEST['target_filename'];

//$outputPath = '../excel/fugafuga.xlsx';
$outputPath = '../excel/'.$file_name;
$filename=basename($outputPath);
$file_size = filesize($outputPath);
$extension = pathinfo($outputPath)['extension'];

header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Type: application/force-download");
header("Content-Length: {$file_size}");
header("Content-Disposition: attachment; filename={$filename}.{$extension}");
readfile($outputPath);

unlink($outputPath);

?>

