<link href="<?php echo $module_path; ?>/css/font-awesome-4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
<link href="<?php echo $module_path; ?>/css/hvirfill.css" rel="stylesheet" type="text/css">
<link href="<?php echo $module_path; ?>/css/bootstrap.css" rel="stylesheet" type="text/css">
<link href="<?php echo $module_path; ?>/css/print.css" rel="stylesheet" type="text/css" media="print" />
<script src="<?php echo $module_path; ?>/js/inline-0.9.4.js"></script>
<script src="<?php echo $module_path; ?>/js/rivets.bundled.min.js"></script>
<script src="<?php echo $module_path; ?>/js/moment-with-locales.min.js"></script>
<script src="<?php echo $module_path; ?>/js/jquery-2.1.3.min.js"></script>
<script src="<?php echo $module_path; ?>/js/bindings.js"></script>

<div id="content" style="display: none;">
  <div class="container"> 
    <div class="col-xs-12">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h4 class="print-heading"><?php if ($lang == 'is') : ?>Barnamenningarhátíð 17-24.04.2018<?php else : ?>Childrens culture festival 17-23.04.2018<?php endif; ?></h4>
          <h4 class="print-heading"><?php if ($lang == 'is') : ?>Mín dagskrá<?php else : ?>My program<?php endif; ?></h4>
        </div>
        <div class="panel-body">
          <table class="table">
            <thead>
              <th><?php if ($lang == 'is') : ?>Tími<?php else : ?>Time<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Staður<?php else : ?>Place<?php endif; ?></th>
              <th><?php if ($lang == 'is') : ?>Heimilisfang<?php else : ?>Location<?php endif; ?></th>
            </thead>
            <tbody>
          	  <tr rv-each-item="app.events">
                <td>
                  <span rv-text="item.start | datetime"></span>
                </td>
                <td>
                  <span rv-lang-title="item"></span>
                </td>
                <td>
                  <span rv-lang-place="item"></span>,
                  <span rv-text="item | address"></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel-footer">
          <div class="panel-heading">
            <p>
            <?php if ($lang == 'is') : ?>
              * Athugið að þessi dagskrá getur breyst án fyrirvara. Nýjusta útgáfa dagskráar er á barnamenningarhatid.is
            <?php else : ?>
              * Attention that this program can change without any warning. The newest version of the program is available at childrensculturefestival.is
            <?php endif; ?>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container">
    <div class="col-xs-12">
      <button onclick="printer()" class="btn filter-btn collapsed pull-right noprint">
        <?php if ($lang == 'is') : ?>Prenta<?php else : ?>Print<?php endif; ?>
      </button>
    </div>
  </div>
</div>

<script type="text/javascript">
    
    HVIRFILL = {};
    HVIRFILL.lang = '<?php echo $lang; ?>';
    HVIRFILL.data = {
        code: '<?php echo $code; ?>',
        token: '<?php echo $token; ?>',
        hidden: <?php echo $hidden; ?>,
    }

</script>

<script src="<?php echo $module_path; ?>/js/print-events.js?v2"></script>

<script>
function printer() {
    window.print();
}
</script>

