$(document).ready(function() {

  // enable the submit button when content has text.
  function toggle_form_submit(event) {
    $('#form-submit').
      attr("disabled",
           $("#user-login-message.not-logged-in").length >= 1 ||
           $('#form-content').val().length <= 0);
  }
  $('#form-content').on('keyup', toggle_form_submit);

  // get the username
  $.getJSON('http://www.gotoknow.org/api/users/full_name.json', {},
    function(data, textStatus, jqXHR) {
      $("#user-login-message").
        removeClass("not-logged-in").
        addClass("logged-in").
        html(data);
    }).error(function(jqXHR, textStatus, data) {
      // not sure what to do yet.
      $("#user-login-message").
        removeClass("logged-in").
        addClass("not-logged-in");
    }).complete(function(jqXHR, textStatus, data) {
      toggle_form_submit();
    });

  // .home-link navigates to GotoKnow
  $('.home-link').on('click', function() {
    chrome.tabs.create({'url': 'http://www.gotoknow.org/'});
  });

  // 'no login' message navigates to GotoKnow
  $('#user-login-message').on('click', function(event) {
    chrome.tabs.create({'url': ($(event.target).hasClass("not-logged-in") ?
                               'http://www.gotoknow.org/user_session/new' :
                               'http://www.gotoknow.org/dashboard') });
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

  // post the form
  $('form.form-journal-entry').submit(function(event) {
    var form = $(event.target);

    form.find("#indicator").removeClass("hidden");
    $.post('http://www.gotoknow.org/api/journals/entries.json', {
        content: form.find('#form-content').val()
      },
      function(data, textStatus, jqXHR) {
        // not sure what to do yet.
      },
      "json"
    ).error(function(jqXHR, textStatus, data) {
      alert(data);
    }).complete(function(jqXHR, textStatus, data) {
      form.find("#indicator").addClass("hidden");
    });
    event.preventDefault();
    return true;
  });

  // restore un-posted message from localStorage
  $('#form-content').val(localStorage['gotoknow-express-form-content']);

  // event binding: save un-posted message to localStorage
  $('#form-content').change(function() {
    localStorage['gotoknow-express-form-content'] = $('#form-content').val();
  });

  // fire change() when the popup is closed
  $(window).unload(function() { $('#form-content').change(); });

  toggle_form_submit();
});

