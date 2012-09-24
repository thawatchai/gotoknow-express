$('.home-link').on('click', function(e) {
  chrome.tabs.create({'url': 'http://www.gotoknow.org/'});
});
