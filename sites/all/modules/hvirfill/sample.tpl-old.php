<div>
  <section id="events-container" class="noselect col-xs-12 nogutter-desktop">
    <div class="resultContainer" scroll="true" data-bind="foreach: events, visible: events().length" style="display: none">
      <div class="event-item col-xs-12 col-sm-3 col-md-2 pointer nogutter-mobile">
        <a data-bind="attr: {href: $root.mainPage + $data._id}">
          <div class="event-inner col-xs-12 nogutter">
            <div class="col-xs-4 col-sm-12 nogutter">
            <img class="img-responsive" data-bind="attr: {src: $root.server + '/images/' + $data.image.medium}"/> 
            </div>      
            <div class="event-title col-xs-8 col-sm-12">
              <h4 data-bind="text: $data.language[$root.lang].title"></h4>
            <?php if ($config->sample_show_time) : ?>
              <h6 data-bind="dateTime: $data.start"></h6>
            <?php endif; ?>
            </div>
          </div>     
         </a>
      </div>
    </div> 
  </section>
</div>
<input type="hidden" id="lang" value="<?php echo $lang; ?>"/>

<script>

HVIRFILL_SAMPLE_DATA = {
  lang: '<?php echo $lang; ?>',
  hidden: <?php echo $hidden; ?>,
  config: <?php echo $jsonConfig; ?>
}

</script>

<script src="/sites/all/modules/hvirfill/js/sample.js"></script>

