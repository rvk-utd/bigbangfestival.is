Drupal.behaviors.fb_likebox = {
  attach: function (context, settings) {
		if (context !== document) {
		  // AJAX request.
		  return;
		}

		(function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s);
		  js.id = id;
		  js.src = "//connect.facebook.net/" + settings.fb_likebox_language + "/sdk.js#xfbml=1&version=v2.3";
		  if (settings.fb_likebox_app_id) {
			js.src += "&appId=" + settings.fb_likebox_app_id;
		  }
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk', settings));
	}
};
