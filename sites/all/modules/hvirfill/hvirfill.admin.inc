<?php

    // admin landing page

    function hvirfill_admin_landing_page() {
        return theme('admin_view', array());
    }

    // validation for forms

    function hvirfill_validate_number($element) {
        if (!is_numeric($element['#value'])) {
            form_error($element, t('Number of events must be a number.'));
        }
    }

    function hvirill_validate_event_id($element) {
        if (!hvirill_valid_id($element['#value'])) {
            form_error($element, t('Invalid event id.'));
        }
    }

    // settings

    function hvirfill_settings_form() {

        $settings_string = variable_get('hvirfill_settings');
        $settings = json_decode($settings_string, true);

        $form = array(
            'columns' => array(
                '#title'            => t('Columns'),
                '#type'             => 'select',
                '#options'          => array(
                    '1' => '1',
                    '2' => '2',
                    '3' => '3',
                    '4' => '4',
                    '5' => '5',
                ),
                '#default_value'    => $settings['columns'],
                '#description'      => t('Number of columns to display on events page.'),
            ),
            'events_no' => array(
                '#title'            => t('Events'),
                '#type'             => 'textfield',
                '#maxlength'        => 3,
                '#size'             => 3,
                '#element_validate' => array('hvirfill_validate_number'),
                '#required'         => true,
                '#default_value'    => $settings['events_no'],
                '#description'      => t('Number of events to load'),
            ),
            'tags' => array(
                '#title'            => t('Tags'),
                '#type'             => 'textarea',
                '#default_value'    => implode('\n', $settings['tags']),
                '#description'      => t('Tags of events to show. Tags are seperated by line.'),
            ),
            'is_start_date' => array(
                '#title'            => t('Use start date'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['is_start_date'],
            ),
            'start_date' => array(
                '#title'            => t('Start date'),
                '#type'             => 'date',
                '#default_value'    => $settings['start_date'],
                '#description'      => t('Show events form the date.'),
            ),
            'is_end_date' => array(
                '#title'            => t('Use end date'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['is_end_date'],
            ),
            'end_date' => array(
                '#title'            => t('End date'),
                '#type'             => 'date',
                '#default_value'    => $settings['end_date'],
                '#description'      => t('Don\'t show events after thes date.'),
            ),
            'is_search' => array(
                '#title'            => t('Search input'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['is_search'],
                '#description'      => t('Allow users to search events.'),
            ),
            'is_datepicker' => array(
                '#title'            => t('Datepicker'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['is_datepicker'],
                '#description'      => t('Allow users to pick a date.'),
            ),
            'show_time' => array(
                '#title'            => t('Show time'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['show_time'],
                '#description'      => t('Show time in event box.'),
            ),
            'is_bookmark' => array(
                '#title'            => t('Bookmark'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['is_bookmark'],
                '#description'      => t('Allow users to bookmark events.'),
            ),
            'is_english_fallback' => array(
                '#title'            => t('English as fallback language'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['is_english_fallback'],
                '#description'      => t('Display events in english if the site language is not icelandic or english.'),
            ),
            'submit' => array(
                '#type'             => 'submit',
                '#value'            => t('Save'),
            ),
        );

        return $form;
    }

    function hvirfill_settings_form_submit($form, &$form_state) {
        $values = $form_state['values'];
        $settings = json_decode(variable_get('hvirfill_settings'), true);

        $tags = trim($values['tags']);
        $settings['tags'] = array();
        if (strlen($tags) > 0) {
            foreach (explode('\n', $tags) as $tag) {
                $settings['tags'][] = trim($tag);
            }
        }

        $fields = array(
            'columns', 'events_no', 'is_start_date', 'start_date', 'is_end_date', 'end_date',
            'is_search', 'is_datepicker', 'show_time', 'is_bookmark', 'is_english_fallback'
        );

        foreach ($fields as $field) {
            $settings[$field] = $values[$field];
        }

        variable_set('hvirfill_settings', json_encode($settings));
        drupal_set_message(t('Settings saved'));
        drupal_set_message($values['tags']);
    }

    // sample settings

    function hvirfill_sample_form() {

        $settings_string = variable_get('hvirfill_settings');
        $settings = json_decode($settings_string, true);

        $form = array(
            'main_page_path' => array(
                '#title'            => t('Path to hvirfill page'),
                '#type'             => 'textfield',
                '#default_value'    => $settings['main_page_path'],
                '#description'      => t('The page you will be redirected to when click on an event. If left blank you will be redirected to hvirfill.reykjavik.is'),
            ),
            'sample_events_no' => array(
                '#title'            => t('Events'),
                '#type'             => 'textfield',
                '#maxlength'        => 2,
                '#size'             => 2,
                '#element_validate' => array('hvirfill_validate_number'),
                '#required'         => true,
                '#default_value'    => $settings['sample_events_no'],
                '#description'      => t('Number of events to display.'),
            ),
            'sample_is_random' => array(
                '#title'            => t('Random'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['sample_is_random'],
                '#description'      => t('Show random events.'),
            ),
            'sample_show_time' => array(
                '#title'            => t('Show time'),
                '#type'             => 'checkbox',
                '#default_value'    => $settings['sample_show_time'],
                '#description'      => t('Show time in event box.'),
            ),
            'submit' => array(
                '#type'             => 'submit',
                '#value'            => t('Save'),
            ),
        );

        return $form;
    }

    function hvirfill_sample_form_submit($form, &$form_state) {
        $values = $form_state['values'];
        $settings = json_decode(variable_get('hvirfill_settings'), true);

        $settings['main_page_path'] = $values['main_page_path'];
        $settings['sample_events_no'] = $values['sample_events_no'];
        $settings['sample_is_random'] = $values['sample_is_random'];
        $settings['sample_show_time'] = $values['sample_show_time'];

        variable_set('hvirfill_settings', json_encode($settings));
        drupal_set_message(t('Settings saved'));
    }

    function hvirfill_hidden_form() {

        $form = array(
            'event_id' => array(
                '#title'            => t('Event ID'),
                '#type'             => 'textfield',
                '#default_value'    => '',
                '#maxlength'        => 24,
                '#required'         => true,
                '#element_validate' => array('hvirill_validate_event_id'),
            ),
            'submit' => array(
                '#type'             => 'submit',
                '#value'            => t('Save'),
            ),
        );

        return $form;
    }

    // manage hidden events

    function hvirfill_hidden() {
        $build = array();
        $rows = array();

        $header = array(
            'event_id' => array('data' => t('Event ID')),
            'operations' => array('data' => t('Operations'), 'colspan' => 2),
        );

        $result = db_query('SELECT fid, event_id FROM {hvirfill_hidden} ORDER BY time DESC');
        foreach ($result as $r) {
            $row = array();
            $row[] = '<a href="https://hvirfill.reykjavik.is/events.html#'.$r->event_id.'" target="_blank">'.$r->event_id.'</a>';
            $row[] = array('data' => l(t('delete'), 'admin/config/hvirfill/hidden/'.$r->fid.'/delete'));
            $rows[] = $row;
        }

        $build['list'] = array(
            '#prefix' => '<h3>Hidden events</h3>',
            '#theme' => 'table',
            '#header' => $header,
            '#rows' => array_values($rows),
            '#empty' => t('No available search pages.'),
        );

        $build['pager'] = array(
            '#theme' => 'pager',
            //'#quantity' => 20,
            '#weight' => 10,
        );

        return $build;
    }

    function hvirfill_hidden_form_submit($form, &$form_state) {

        $values = $form_state['values'];

        $fid = db_insert('hvirfill_hidden')->fields(array(
            'event_id' => $values['event_id'],
            'time' => time(),
        ))->execute();

        $form_state['redirect'] = 'admin/config/hvirfill/hidden';
        drupal_set_message(t('Entry created'));
    }

    function hvirfill_hidden_delete($form, &$form_state, $fid) {

        $form['fid'] = array(
            '#type' => 'hidden',
            '#value' => $fid,
        );

        return confirm_form(
            $form,
            t('Are you sure you want to delete this event ID?'),
            'admin/config/hvirfill/hidden',
            NULL,
            t('Delete'),
            t('Cancel')
        );
    }

    function hvirfill_hidden_delete_submit($form, &$form_state) {
        $fid = $form_state['values']['fid'];
        db_query("DELETE FROM {hvirfill_hidden} WHERE fid = $fid");
        $form_state['redirect'] = 'admin/config/hvirfill/hidden';
        drupal_set_message(t('Event entry deleted'));
    }

    // manage bookmarks

    function hvirfill_bookmarks() {
        $build = array();
        $rows = array();

        $header = array(
            'uid' => array('data' => t('Event ID')),
            'code' => array('data' => t('Code')),
            'operations' => array('data' => t('Operations'), 'colspan' => 2),
        );

        $result = db_query('SELECT fid, uid, code FROM {hvirfill_bookmark} ORDER BY time DESC');
        foreach ($result as $r) {
            $row = array();
            $row[] = '<a href="https://hvirfill.reykjavik.is/events.html#/s/'.$r->uid.'" target="_blank">'.$r->uid.'</a>';
            $row[] = $r->code;
            $row[] = array('data' => l(t('delete'), 'admin/config/hvirfill/bookmark/'.$r->fid.'/delete'));
            $rows[] = $row;
        }

        $build['list'] = array(
            '#prefix' => '<h3>Bookmarked events</h3>',
            '#theme' => 'table',
            '#header' => $header,
            '#rows' => array_values($rows),
            '#empty' => t('No available search pages.'),
        );

        $build['pager'] = array(
            '#theme' => 'pager',
            //'#quantity' => 20,
            '#weight' => 10,
        );

        return $build;
    }

    function hvirfill_bookmark_delete($form, &$form_state, $fid) {

        $form['fid'] = array(
            '#type' => 'hidden',
            '#value' => $fid,
        );

        return confirm_form(
            $form,
            t('Are you sure you want to delete this bookmark?'),
            'admin/config/hvirfill/hidden',
            NULL,
            t('Delete'),
            t('Cancel')
        );
    }

    function hvirfill_bookmark_delete_submit($form, &$form_state) {
        $fid = $form_state['values']['fid'];
        db_query("DELETE FROM {hvirfill_bookmark} WHERE fid = $fid");
        $form_state['redirect'] = 'admin/config/hvirfill/bookmarks';
        drupal_set_message(t('Event entry deleted'));
    }

    // ajax hide event

    function hvirfill_hide_event() {
        if (!isset($_POST['event_id']))
            return hvirfill_json_error_output('missing event_id');
        if (!hvirill_valid_id($_POST['event_id']))
            return hvirfill_json_error_output('invalid event_id');

        db_insert('hvirfill_hidden')->fields(array(
            'event_id' => $_POST['event_id'],
            'time' => time(),
        ))->execute();

        drupal_json_output(array('success' => true));
    }

    // ajax bookmark functions

    function hvirfill_add_bookmark() {
        //if (!hvirfill_test_token())
        //    return hvirfill_json_error_output('invalid token');
        if (!isset($_POST['code']))
            return hvirfill_json_error_output('missing code');
        if (!isset($_POST['uid']))
            return hvirfill_json_error_output('missing uid');
        if (!hvirill_valid_id($_POST['uid']))
            return hvirfill_json_error_output('invalid uid');

        $uid = $_POST['uid'];
        $code = $_POST['code'];

        $result = db_query("SELECT uid FROM {hvirfill_bookmark} WHERE uid = '$uid' AND code = '$code'");
        if ($result->rowCount() == 0) {
            db_insert('hvirfill_bookmark')->fields(array(
                'uid' => $uid,
                'code' => $code,
                'time' => time(),
            ))->execute();
        }
        drupal_json_output(array('success' => true));
    }

    function hvirfill_del_bookmark() {
        //if (!hvirfill_test_token())
        //    return hvirfill_json_error_output('invalid token');
        if (!isset($_POST['code']))
            return hvirfill_json_error_output('missing code');
        if (!isset($_POST['uid']))
            return hvirfill_json_error_output('missing uid');
        if (!hvirill_valid_id($_POST['uid']))
            return hvirfill_json_error_output('invalid uid');

        $uid = $_POST['uid'];
        $code = $_POST['code'];
        db_query("DELETE FROM {hvirfill_bookmark} WHERE uid = '$uid' AND code = '$code'");

        drupal_json_output(array('success' => true));
    }

    function hvirfill_get_bookmarks() {
        //if (!hvirfill_test_token())
        //    return hvirfill_json_error_output('invalid token');
        if (!isset($_POST['code']))
            return hvirfill_json_error_output('missing code');

        $code = $_POST['code'];

        $uids = array();
        $result = db_query("SELECT uid FROM {hvirfill_bookmark} WHERE code = '$code'");
        foreach ($result as $row) {
            $uids[] = $row->uid;
        }

        drupal_json_output($uids);
    }
