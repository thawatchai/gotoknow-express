$(document).ready(function() {

  // .home-link navigates to GotoKnow
  $('.home-link').on('click', function() {
    chrome.tabs.create({'url': 'http://www.gotoknow.org/'});
  });

  // 'no login' message navigates to GotoKnow
  $('#user-login-message').on('click', function() {
    chrome.tabs.create({'url': 'http://www.gotoknow.org/user_session/new'});
  });

  // return a markdown link
  function markdown_link(title, url) {
    return '[' + title.replace('[', '').replace(']', '') + '](' + url.replace('(', '').replace(')', '') + ')'
  }

  // event binding: when pressed #share-this-page-button, put a markdown link of the selected tab to the textarea
  $('#share-this-page-button').on('click', function(e) {
    chrome.tabs.getSelected(null, function(tab) {
      var c = $('#form-content');
      c.val(c.val() + markdown_link(tab.title, tab.url));
      $('#form-content').change();
    });
  });

  // restore un-posted message from localStorage
  $('#form-content').val(localStorage['gotoknow-express-form-content']);

  // event binding: save un-posted message to localStorage
  $('#form-content').change(function() {
    localStorage['gotoknow-express-form-content'] = $('#form-content').val();
  });

  // fire change() when the popup is closed
  $(window).unload(function() { $('#form-content').change(); });

});

