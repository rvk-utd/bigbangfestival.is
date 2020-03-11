<?php
/**
 * @file
 * <my_module>.exclude_from_update_list.inc
 */

/**
 * Implements hook_update_projects_alter().
 */

function hvirfill_update_projects_alter(&$projects) {
  unset($projects['hvirfill']);
}