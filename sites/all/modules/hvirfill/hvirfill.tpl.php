
<link href="/<?php echo $module_path; ?>/css/font-awesome-4.3.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&region=is&language=is"></script>

<div id="searchContainer" class="row">

<div id="preloader" style="display: none;" data-bind="visible: loading"></div>
<div id="preloader-bubble" style="display: none;" data-bind="visible: loading"></div>

<noscript><p>Vinsamlegast virkjaðu JavaScript í vafranum til að sjá dagskránna.</p></noscript>

<div id="fb-root"></div>

<!-- Navigation -->


<div id="hvirfill">
  <header id="navbar" role="banner" class="navbar-default" role="banner">
    <div class="navbar-filter col-xs-12">

      <div class="navbar-filter-toggle">

        <!-- .btn-navbar is used as the toggle for collapsed navbar content -->
        <div class="col-xs-6 nogutter-mobile">

        </div>

        <div class="col-xs-6 nogutter-mobile">
          <div rv-hide="app.isBookmarkMode">
            <button type="button" class="btn filter-btn navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse-filter">
              <i class="fa fa-cog fa-fw"></i>
              <span rv-text="'Advanced search' | i18n"></span>
              <span class="sr-only" rv-text="'Advanced search' | i18n"></span>
            </button>
          </div>
        </div>
      </div>

      <div class="navbar-collapse-filter collapse">
        <nav role="navigation">
          <div rv-show="app.isBookmarkMode">
          <div class="search-wrapper col-xs-12 nogutter filtered">
          <div class="form-group col-xs-12 col-sm-4 col-md-2">
            <button type="button" class="btn filter-btn collapsed" rv-on-click="app.bookmarkMode" rv-hide="app.isMobile">
              <i class="fa fa-th fa-fw"></i>
              <span rv-text="'All events' | i18n"></span>
              <span class="sr-only" rv-text="'All events' | i18n"></span>
            </button>
            </div>
            <div class="form-group col-xs-12 col-sm-4 col-md-2">
            <button type="button" class="btn filter-btn collapsed"  rv-on-click="app.printEvents">
              <i class="fa fa-print fa-fw"></i>
              <span rv-text="'Print program' | i18n"></span>
              <span class="sr-only" rv-text="'Print program' | i18n"></span>
            </button>
            </div>
            </div>
          </div>

          <div rv-hide="app.isBookmarkMode">
            <div class="search-wrapper col-xs-12 nogutter filtered">

              <div class="searchBox form-group col-xs-12 col-sm-4 col-md-2">
                <input id="search-input" class="form-control" rv-placeholder="'Search' | i18n" rv-on-input="app.search"/>
              </div>

              <div class="form-group col-xs-12 col-sm-4 col-md-2">
                <select id="date-input" class="form-control select pointer filter" rv-on-change="app.selectDay">
                  <option value="2019-04-09,2019-04-15" rv-i18n="'Day'"></option>
                  <option value="2019-04-09,2019-04-10" rv-text="'2019-04-09' | date"></option>
                  <option value="2019-04-10,2019-04-11" rv-text="'2019-04-10' | date"></option>
                  <option value="2019-04-11,2019-04-12" rv-text="'2019-04-11' | date"></option>
                  <option value="2019-04-12,2019-04-13" rv-text="'2019-04-12' | date"></option>
                  <option value="2019-04-13,2019-04-14" rv-text="'2019-04-13' | date"></option>
                  <option value="2019-04-14,2019-04-15" rv-text="'2019-04-14' | date"></option>
                </select>
              </div>

              <div class="pull-right col-xs-12 col-sm-1 form-group">
                <span class="pull-right pointer fa-stack fa-1x" rv-on-click="app.reset">
                  <div class="droplet-1x"><i class="fa fa-caret-up fa-stack-2x fa-inverse"></i></div>
                  <i class="fa fa-stop fa-stack-2x fa-inverse"></i>
                  <i class="fa fa-times fa-stack-1x"></i>
                </span>
              </div>
            </div>
          </nav>
        </nav>
      </div>
    </div>
  </header>

  <!-- /.container-fluid -->

  <section id="events-container" class="col-xs-12 nogutter">
    <div class="resultContainer" scroll="true">

      <div rv-each-item="app.events">

        <div class="date-item noselect col-xs-12 clear-both" rv-if="item | splitter">
          <div class="date-inner">
            <div class="date-inner-time col-xs-6 col-sm-3 col-md-2 nogutter">
              <h4 rv-text="item.splitter | date"></h4>
            </div>
            <hr class="col-xs-6 col-sm-9 col-md-10 nogutter"></hr>
          </div>
        </div>

        <div class="event-item col-xs-12 col-sm-4 col-lg-3">
          <div class="event-inner col-xs-12 nogutter">
            <div class="event-mobile-image col-xs-4 col-sm-12 nogutter pointer" rv-on-click="app.openModal">
              <img class="img-responsive" rv-img-medium="item"/>
            </div>
            <div class="event-title col-xs-7 col-sm-12 pointer" rv-on-click="app.openModal">
              <h3 rv-lang-title="item"></h3>
            </div>
            <div class="event-detail col-xs-8 col-sm-12" rv-on-click="app.openModal">
              <h5 class="place" rv-lang-place="item"></h5>
              <h5 class="time">
                <span rv-text="item | timerange"></span>
              </h5>
            </div>
          </div>
        </div>

      </div>

    </div>

    <div rv-show="app.noResult">
      <hr class="col-xs-12"/>
      <div class="col-xs-12 padding-top-bottom-20">
        <p rv-i18n="'no events found'"></p>
      </div>
    </div>

  </section>

  <div rv-show="app.modal">
    <div id="modal" class="modal modal-event">

      <div class="modal-header-event" rv-if="app.modal">
        <nav>
          <ul class="pager">

            <?php if (user_is_logged_in()) : ?>
            <a class="pointer prev">
              <span class="fa-stack fa-2x" data-bind="click: adminHide">
                <div class="droplet-2x">
                  <i class="fa fa-caret-up fa-stack-2x light-blue"></i>
                </div>
                <i class="fa fa-stop fa-stack-2x"></i>
                <i class="fa fa-trash-o fa-inverse"></i>
              </span>
            </a>
            <?php endif; ?>

            <a class="pointer next">
              <span class="fa-stack fa-2x" rv-on-click="app.closeModal">
                <div class="droplet-2x">
                  <i class="fa fa-caret-up fa-stack-2x light-blue"></i>
                </div>
                <i class="fa fa-stop fa-stack-2x"></i>
                <i class="fa fa-times fa-stack-1x fa-inverse"></i>
              </span>
            </a>
            <a class="pointer next" rv-on-click="app.next">
              <span class="fa-stack fa-2x">
                <div class="droplet-2x">
                  <i class="fa fa-caret-up fa-stack-2x light-blue"></i>
                </div>
                <i class="fa fa-stop fa-stack-2x"></i>
                <i class="fa fa-chevron-right fa-stack-1x fa-inverse"></i>
              </span>
            </a>
            <a class="pointer next" rv-on-click="app.prev">
              <span class="fa-stack fa-2x">
                <div class="droplet-2x">
                  <i class="fa fa-caret-up fa-stack-2x light-blue"></i>
                </div>
                <i class="fa fa-stop fa-stack-2x"></i>
                <i class="fa fa-chevron-left fa-stack-1x fa-inverse"></i>
              </span>
            </a>
            <a class="pointer next" rv-on-click="app.toggleMap">
              <span class="fa-stack fa-2x pointer">
                <div class="droplet-2x">
                  <i class="fa fa-caret-up fa-stack-2x light-blue" rv-class-lightyellow="app.isMap"></i>
                </div>
                <i class="fa fa-stop fa-stack-2x" rv-class-yellow="app.isMap"></i>
                <i class="fa fa-map-marker fa-stack-1x fa-inverse"></i>
              </span>
            </a>
          </ul>
        </nav>
      </div>
      <div class="modal-map" rv-show="app.isMap">
        <div id="modal-map" class="map-container"></div>
      </div>
      <div class="modal-content-event" rv-if="app.modal" rv-hide="app.isMap">

        <div class="modal-inner-wrapper">
          <div class="modal-inner row null-row" data-bind="if: isModal">

            <div class="modal-img col-xs-12 col-sm-8 col-md-5 col-lg-8 nogutter-mobile-nogutter-left-desktop">
                <img class="img-responsive" rv-img-large="app.modal">
            </div>

            <div class="col-xs-12 col-sm-8 col-md-12 col-lg-8 hidden-desktop">

              <div class="col-xs-12 nogutter content-text">
                <div class="event-title">
                  <h2 rv-lang-title="app.modal"></h2>
                </div>
                <div class="event-text">
                  <p rv-lang-text="app.modal"></p>
                </div>
              </div>
            </div>
                        <div class="row null-row col-xs-12 col-sm-4 col-md-7 col-lg-4 nogutter-mobile pull-right">
              <div class="col-xs-12 col-md-6 col-lg-12 padding-top-bottom-10 nogutter-left-desktop">
                <h4 rv-text="'Information' | i18n"></h4>
                <h5 rv-text="'Time and date' | i18n"></h5>
                <span>
                  <span rv-text="app.modal.start | date"></span>
                  <span rv-text="app.modal | timerange"></span>
                </span>

                <h5 rv-text="'Location' | i18n"></h5>
                <span rv-lang-place="app.modal"></span>
                <h5 rv-text="'Address' | i18n"></h5>
                <span rv-text="app.modal.street"></span>,
                <span rv-text="app.modal.postal"></span>,
                <span rv-text="app.modal.city"></span>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-6 col-lg-12 padding-top-bottom-10">
                  <h4 rv-text="'Event media' | i18n"></h4>
                  <media>
                    <h5>
                      <a rv-href="app.modal | link">
                        <span class="fa-stack fa-1x">
                          <div class="droplet-1x"><i class="fa fa-stop fa-stack-2x"></i></div>
                          <i class="fa fa-stop fa-stack-2x"></i>
                          <i class="fa fa-share-alt fa-stack-1x fa-inverse"></i>
                        </span>
                        <span rv-text="'Link' | i18n"></span>
                      </a>
                    </h5>
                  </media>
                  <media lass="pointer" class="pointer" rv-if="app.modal.media.website">
                    <h5>
                      <a target="_blank" rv-href="app.modal.media.website">
                        <span class="fa-stack fa-1x">
                        <div class="droplet-1x"><i class="fa fa-stop fa-stack-2x"></i></div>
                          <i class="fa fa-stop fa-stack-2x"></i>
                          <i class="fa fa-external-link fa-stack-1x fa-inverse"></i>
                        </span>
                        <span rv-text="'Website' | i18n"></span>
                      </a>
                    </h5>
                  </media>
                  <media rv-if="app.modal.media.youtube">
                    <h5>
                      <a class="pointer" target="_blank" rv-href="app.modal.media.youtube | youtubeurl">
                        <span class="fa-stack fa-1x">
                          <div class="droplet-1x"><i class="fa fa-stop fa-stack-2x"></i></div>
                          <i class="fa fa-stop fa-stack-2x"></i>
                          <i class="fa fa-youtube fa-stack-1x fa-inverse"></i>
                        </span>
                        <span>Youtube</span>
                      </a>
                    </h5>
                  </media>
                  <media rv-if="app.modal.media.twitter">
                    <h5>
                      <a class="pointer" target="_blank" rv-href="app.modal.media.twitter">
                        <span class="fa-stack fa-1x">
                          <div class="droplet-1x"><i class="fa fa-stop fa-stack-2x"></i></div>
                          <i class="fa fa-stop fa-stack-2x"></i>
                          <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
                        </span>
                        <span>Twitter</span>
                      </a>
                    </h5>
                  </media>
              </div>
            </div>


          <div class="col-xs-12 col-sm-8 col-md-12 col-lg-8 hidden-mobile">

              <div class="col-xs-12 nogutter content-text">
                <div class="event-title">
                  <h2 rv-lang-title="app.modal"></h2>
                </div>
                <div class="event-text">
                  <p rv-lang-text="app.modal"></p>
                </div>
              </div>
            </div>




            </div>

          </div>
        </div>
    </div>

  </div>

  <div class="modal fade login-modal in modal-cookie" style="display:none;" data-bind="">
    <div class="modal-dialog modal-dialog-lg">
      <div class="modal-content">
        <div class="modal-header">
          <a class="c-close c-hide-text" data-dismiss="modal" href="javascript: void 0;">close this window</a>
        </div>
        <div class="modal-body"></div>
      </div>
    </div>

  </div>

  <div class="modal-backdrop fade in" style="display:none;"></div>

   <div id="event-bottom"></div>

  <div class="bookmark-dialog" id="bookmark-dialog" style="display: none;">
    <div class="container nogutter bookmark-dialog-wrapper">
      <div class="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 bookmark-dialog-content text-center">
        <div class="padding-top-bottom-20" data-bind="i18n: 'you have to authenticate with facebook to use the program features. being authenticated you can transfer your program between devices by being logged into facebook'"></div>
      <div class="col-xs-12">

      <div data-bind="visible: isMobile()">

        <div class="col-xs-5 bookmark-dialog-icon">
          <i class="fa fa-2x fa-facebook-square info"></i>
          <i class="fa fa-2x fa-sign-in"></i>
        </div>
        <div class="col-xs-2 bookmark-dialog-icon">
          <i class="fa fa-2x fa-share-alt"></i>
        </div>
        <div class="col-xs-5 bookmark-dialog-icon">
          <i class="fa fa-2x fa-desktop"></i>
          <i class="fa fa-2x fa-tablet"></i>
          <i class="fa fa-2x fa-mobile"></i>
        </div>
      </div>

      <div data-bind="visible: !isMobile()">

        <div class="col-sm-5 padding-top-bottom-20 bookmark-dialog-icon">
          <i class="fa fa-4x fa-facebook-square info"></i>
          <i class="fa fa-4x fa-sign-in"></i>
        </div>
        <div class="col-sm-2 padding-top-bottom-20 bookmark-dialog-icon">
          <i class="fa fa-4x fa-share-alt"></i>
        </div>
        <div class="col-sm-5 padding-top-bottom-20 bookmark-dialog-icon">
          <i class="fa fa-4x fa-desktop"></i>
          <i class="fa fa-4x fa-tablet"></i>
          <i class="fa fa-4x fa-mobile"></i>
        </div>
      </div>

    </div>
    <div class="col-xs-12 text-center padding-top-bottom-20">
      <button class="btn blue-btn" id="bookmark-dialog-cancel" data-bind="i18n: 'cancel'"></button>
      <button class="btn blue-btn" id="bookmark-dialog-ok" data-bind="i18n: 'ok'"></button>
    </div>
    </div>
  </div>
</div>

<script>

  HVIRFILL.lang = '<?php echo $lang; ?>';
  HVIRFILL.data = {
      uid: '<?php echo $uid; ?>',
      token: '<?php echo $token; ?>',
      hidden: <?php echo $hidden; ?>,
      config: <?php echo $jsonConfig; ?>,
  }

</script>

<script src="/sites/all/modules/hvirfill/js/hvirfill.js?v2"></script>
