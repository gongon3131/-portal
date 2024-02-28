<?php

require '../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\Reader\Xlsx as Reader;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as Writer;

$reader = new Reader;
$file_name = './Book1.xlsx';
$spreadsheet = $reader->load($file_name);

$sheet       = $spreadsheet->getActiveSheet();
date_default_timezone_set('Asia/Tokyo');
$sheet->getCell( 'B3' )->setValue( date("Y/m/d H:i:s") );

$writer = new Writer($spreadsheet);
$outputPath = './hogehoge.xlsx';
$writer->save( $outputPath );

print_r("hogefuga!");

?>