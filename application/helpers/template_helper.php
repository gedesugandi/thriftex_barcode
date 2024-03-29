<?php

function get_template_directory($path,$dir_file){
	global $SConfig;

	$replace_path = str_replace('\\','/',$path);
	$get_digit_doc_root = strlen($SConfig->_document_root);
	$full_path = substr($replace_path,$get_digit_doc_root);
	return $SConfig->_site_url.$full_path.'/'.$dir_file;
}

function get_template_directory_asst($path,$dir_file){
	global $SConfig;

	$replace_path = str_replace('\\','/',$path);
	$get_digit_doc_root = strlen($SConfig->_document_root);
	$full_path = substr($replace_path,$get_digit_doc_root);
	return $SConfig->_site_url.$full_path.'/'.$dir_file.'?v='.$SConfig->_app_version;
}

function get_template($view){
	$_this =& get_instance();
	return $_this->site->view($view);
}

function set_url($sub){
	$_this =& get_instance();
	if($_this->site->side == 'backend'){
		return site_url('dashboard/'.$sub);
	}
}

function is_active_page_print($page,$class){
	$_this =& get_instance();
	if($_this->site->side == 'backend' && $page == $_this->uri->segment(2)){
		return $class;
	}
}

function is_active_page_print_me($page,$class,$segment){
	$_this =& get_instance();
	if($_this->site->side == 'backend' && $page == $_this->uri->segment($segment)){
		return $class;
	}
}

function app_version(){
	global $SConfig;
	return $SConfig->_app_version;
}
