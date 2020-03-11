<link href="/<?php echo $module_path; ?>/css/font-awesome-4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">

<div id="modal-cookie" class="modal" style="display:inline;">
<div class="modal-content container nogutter padding-top-bottom-20">

<div class="col-xs-12 col-md-6">


<div class="col-xs-12 nogutter">
   <span class="fa-stack fa-3x">
        
        
        <div class="droplet-3x"><i class="fa fa-stop info fa-stack-2x"></i></div>  
        <i class="fa fa-circle info fa-stack-2x"></i> 
        <i class="fa fa-user-plus fa-inverse fa-stack-1x"></i>
        
  </span>

<p>lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. 
Lorem ipsum dolor sit amet,</p> 
</div>

 <?php if ($config->is_bookmark) : ?>
                    <div class="col-xs-12 nogutter padding-top-bottom-10">
                    <div class="input-group">
                    <span class="input-group-addon info-bg"><i class="fa fa-plus fa-fw"></i></span>
                      <input placeholder="Vefkökukóði" class="form-control" data-bind="value: bookmarkCodeInput"/>
                    </div>
                    </div>
            
                    <div class="col-xs-12 nogutter">
                      <button class="btn info-bg" data-bind="click: setBookmarkCode">Vista vefkökukóða</button>
                    </div>
                <?php endif; ?>
                 
</div>

<div class="col-xs-12 col-md-6 clear-both-mobile">

<div class="col-xs-4 nogutter text-center">
  <span class="fa-stack fa-3x">
        <i class="fa fa-desktop info fa-stack-1x"></i>
  </span>
</div>

<div class="col-xs-4 nogutter text-center">
   <span class="fa-stack fa-3x">
        <i class="fa fa-tablet info fa-stack-1x"></i>
  </span>
</div>

<div class="col-xs-4 nogutter text-center">
   <span class="fa-stack fa-3x">
        <i class="fa fa-mobile info fa-stack-1x"></i>
  </span>
  </div>
</div>
<div class="col-xs-12 col-md-6"><p>
lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. 
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, 
pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. 
Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. 
Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. </p>
</div>
</div>

</div>
</div>
<div class="modal-backdrop fade in"></div>