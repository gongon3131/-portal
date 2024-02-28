<?php

// PNG,JPEG,GIF汎用処理用クラス

class Image extends File
{

	var $filename;
	var $resource;
	var $type;
	var $error_count;
	var $error_message;

	// 機能概要：拡張子を取得
	function get_extension(){
		return $this->type;
	}

	// 機能概要：コンストラクター
	// 引数：イメージファイルのパス
	function Image($filename){

		// ファイルの存在を確認
		if(file_exists($filename)){
			$this->filename = $filename;

			// MINEタイプの取得
			$info = getimagesize($filename);

			// リソースの取得
			switch( $info['mime'] ){
				case 'image/png':
					$this->resource = imagecreatefrompng($filename);
					$this->type = "png";
					break;
				case 'image/jpeg':
					$this->resource = imagecreatefromjpeg($filename);
					$this->type = "jpg";
					break;
				case 'image/pjpeg':
					$this->resource = imagecreatefromjpeg($filename);
					$this->type = "jpg";
					break;
				case 'image/gif':
					$this->type = "gif";
					$old_id 		= imagecreatefromgif($filename);
					$this->resource	= imagecreatetruecolor($info[0],$info[1]);
					imagecopy($this->resource,$old_id,0,0,0,0,$info[0],$info[1]);
					break;
				default:
					$this->type = 0;
					return;
			}
			return true;
		}else{
			$this->type = 0;
			return;
		}
	}

	// 機能概要：イメージの描画
	// 引数：なし
	function draw(){

			// MINEタイプの取得
			$info = getimagesize($this->filename);

			header("Content-type: {$info['mime']}");

			// リソースの取得
			switch( $info['mime'] ){
				case 'image/png':
					imagepng($this->resource);
					break;
				case 'image/jpeg':
					imagejpeg($this->resource);
					break;
				case 'image/pjpeg':
					imagejpeg($this->resource);
					break;
				case 'image/gif':
					imagegif($this->resource);
					break;
				default:
					return false;
			}
	}

	// 機能概要：画像の保存
	// 引数：保存先のファイル名
	function save_image($dest){

			// MINEタイプの取得
			$info = getimagesize($this->filename);

			// リソースの取得
			switch( $info['mime'] ){
				case 'image/png':
					imagepng($this->resource,$dest);
					break;
				case 'image/jpeg':
					imagejpeg($this->resource,$dest);
					break;
				case 'image/pjpeg':
					imagejpeg($this->resource,$dest);
					break;
				case 'image/gif':
					if (function_exists("imagegif")){
						//imagegif($this->resource,$dest);
						$this->copy($dest);
					}else{
						$this->copy($dest);
					}
					break;
				default:
					return false;
			}

	}

	// 機能概要：横幅にあわせてサイズの変更
	// 引数：変更後の横幅
	function set_width_size($dest_width){

		// ファイルの情報の取得 0:幅 1:高 2:M
		$info = getimagesize($this->filename);

		// サイズの調整
		$dest_height 	= $info[1] * ($dest_width/$info[0]);
		$dest_image		= imagecreatetruecolor($dest_width,$dest_height);

		$temp_image = $this->resource;
		$this->resource = $dest_image;

		// イメージコピー
		imagecopyresampled ($this->resource,$temp_image,0,0,0,0,$dest_width,$dest_height,$info[0],$info[1]);

	}

	// 機能概要：高幅にあわせてサイズの変更
	// 引数：変更後の横幅
	function set_height_size($dest_height){

		// ファイルの情報の取得 0:幅 1:高 2:M
		$info = getimagesize($this->filename);

		// サイズの調整
		$dest_width 	= $info[0] * ($dest_height/$info[1]);
		$dest_image		= imagecreatetruecolor($dest_width,$dest_height);

		$temp_image = $this->resource;
		$this->resource = $dest_image;

		// イメージコピー
		imagecopyresampled ($this->resource,$temp_image,0,0,0,0,$dest_width,$dest_height,$info[0],$info[1]);

	}

	// 機能概要：画像のリサイズ
	// 引数：変更後の横幅・縦幅
	function resize($dest_width,$dest_height){

		// ファイルの情報の取得 0:幅 1:高 2:M
		$info = getimagesize($this->filename);

		// サイズの調整
		$dest_image		= imagecreatetruecolor($dest_width,$dest_height);

		$temp_image = $this->resource;
		$this->resource = $dest_image;

		// イメージコピー
		imagecopyresampled ($this->resource,$temp_image,0,0,0,0,$dest_width,$dest_height,$info[0],$info[1]);

	}

	// 機能概要：画像の横幅の取得
	// 引数：なし
	function xsize(){
		$info = getimagesize($this->filename);
		return $info[0];
	}

	// 機能概要：画像の縦幅の取得
	// 引数：無し
	function ysize(){
		$info = getimagesize($this->filename);
		return $info[1];
	}

	// 機能概要：イメージの削除
	// 引数：無し
	function destory(){
		imagedestroy($this->resource);
	}

}

?>