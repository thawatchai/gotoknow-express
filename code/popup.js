function markdown_link(title, url) {
  return "[{{title}}]({{url}})".replace('{{title}}', title).replace('{{url}}', url);
}

$('.home-link').on('click', function(e) {
  chrome.tabs.create({'url': 'http://www.gotoknow.org/'});
});

$('#user-login-message').on('click', function(e) {
  chrome.tabs.create({'url': 'http://www.gotoknow.org/user_session/new'});
});

$('#share-this-page-button').on('click', function(e) {
  chrome.tabs.getSelected(null, function(tab) {
    var c = $('#form-content');
    c.val(c.val() + markdown_link(tab.title, tab.url));
  });
});
