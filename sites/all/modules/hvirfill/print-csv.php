<link href="<?php echo $module_path; ?>/css/font-awesome-4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
<link href="<?php echo $module_path; ?>/css/hvirfill.css" rel="stylesheet" type="text/css">
<link href="<?php echo $module_path; ?>/css/bootstrap.css" rel="stylesheet" type="text/css">
<link href="<?php echo $module_path; ?>/css/print.css" rel="stylesheet" type="text/css" media="print" />
<script src="<?php echo $module_path; ?>/js/inline-0.9.4.js"></script>
<script src="<?php echo $module_path; ?>/js/rivets.bundled.min.js"></script>
<script src="<?php echo $module_path; ?>/js/moment-with-locales.min.js"></script>
<script src="<?php echo $module_path; ?>/js/jquery-2.1.3.min.js"></script>
<script src="<?php echo $module_path; ?>/js/bindings.js"></script>
<div><a class="btn filter-btn collapsed" href="#" id="export" role="button"><div>Ná í Excel / CSV skjal</div></a></div>
<div id="content" style="display: none;">
          <table class="table">
            <thead>
              <th><?php if ($lang == 'is') : ?>Viðburðir<?php else : ?>Events<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Titill<?php else : ?>Title<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Texti<?php else : ?>text<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Tími<?php else : ?>Time<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Staður<?php else : ?>Location<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Heimilisfang<?php else : ?>Address<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Vefsíða<?php else : ?>Website<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Facebook<?php else : ?>Facebook<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Twitter<?php else : ?>Twitter<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Youtube<?php else : ?>Youtube<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Merki<?php else : ?>Tags<?php endif; ?></th>
            </thead>
            <tbody>
          	  <tr rv-each-item="app.events">
                <td><span>#</span></td>
                <td><span rv-lang-title="item"></span></td>
                <td><span rv-lang-text="item"></span></td>
                <td><span rv-text="item | timerange"></span></td>
                <td><span rv-lang-place="item"></span></td>
                <td><span rv-text="item | address"></span></td>
                <td><span rv-text="item.media.website"></span></td>
                <td><span rv-text="item.media.facebook | facebookurl"></span></td>
                <td><span rv-text="item.media.twitter"></span></td>
                <td><span rv-text="item.media.youtube | youtubeurl"></span></td>
                <td><span rv-lang-tags="item"></span></td>
              </tr>
            </tbody>
          </table>
</div>

<script type="text/javascript">  
    HVIRFILL = {};
    HVIRFILL.lang = '<?php echo $lang; ?>';
    HVIRFILL.data = {
        token: '<?php echo $token; ?>',
        hidden: <?php echo $hidden; ?>,
    }
</script>

<script src="<?php echo $module_path; ?>/js/print-csv.js"></script>

<script src="//cdn.rawgit.com/rainabba/jquery-table2excel/1.1.0/dist/jquery.table2excel.min.js"></script>

<script> 
  $(".btn").click(function(){
  $("#content").table2excel({
    // exclude CSS class
    exclude: ".Exl",
    name: "menningarnott-data",
    filename: "menningarnott-data", //do not include extension
    fileext: ".xls",
  }); 
});
</script>



