<?php

/**
 * @file
 * Views include file.
 */

/**
 * Implements hook_views_data_alter().
 */
function administerusersbyrole_views_data_alter(&$data) {
  // Change the Views core handler that provides user edit and cancel links
  // so that they take account of our new permissions.
  $data['users']['edit_node']['field']['handler'] = 'administerusersbyrole_handler_field_user_link_edit';
  $data['users']['cancel_node']['field']['handler'] = 'administerusersbyrole_handler_field_user_link_cancel';
}
 
/**
 * Implements hook_views_handlers().
 */
function administerusersbyrole_views_handlers() {
  return array(
    'info' => array(
      'path' => drupal_get_path('module', 'administerusersbyrole') . '/views',
    ),
    'handlers' => array(
      'administerusersbyrole_handler_field_user_link_edit' => array(
        'parent' => 'views_handler_field_user_link_edit',
        'file' => 'administerusersbyrole_handler_field_user_link_edit.inc',
      ),
      'administerusersbyrole_handler_field_user_link_cancel' => array(
         'parent' => 'views_handler_field_user_link_cancel',
         'file' => 'administerusersbyrole_handler_field_user_link_cancel.inc',
       ),
    ),
  );
}