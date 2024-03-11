<?php

//トークン取得
$token = $_REQUEST['token'];

//$outputPath = '../excel/hogehoge.xlsx';
$outputPath = '../excel/shift_'.$token.'.xlsx';
$filename=basename($outputPath);
$file_size = filesize($outputPath);
$extension = pathinfo($outputPath)['extension'];

header("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
header("Content-Type: application/force-download");
header("Content-Length: {$file_size}");
header("Content-Disposition: attachment; filename={$filename}.{$extension}");
readfile($outputPath);
//$writer->save('php://output');
//echo json_encode("ok");

unlink($outputPath);

?>

