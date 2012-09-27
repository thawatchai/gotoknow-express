var HOST = 'http://www.gotoknow.org'
//var HOST = 'http://www.kv.dev'

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
  $.getJSON(HOST + '/api/users/full_name.json', {},
    function(data, textStatus, jqXHR) {
      $("#user-login-message").
        removeClass("not-logged-in").
        addClass("logged-in").
        html(data);
    }).error(function(jqXHR, textStatus, data) {
      // not sure what to do yet.
      $('#user-login-message')._t('user-login-message');
      $("#user-login-message").
        removeClass("logged-in").
        addClass("not-logged-in");
    }).complete(function(jqXHR, textStatus, data) {
      toggle_form_submit();
    });

  // .home-link navigates to GotoKnow
  $('.home-link').on('click', function() {
    chrome.tabs.create({'url': HOST });
  });

  // 'no login' message navigates to GotoKnow
  // user.full_name goes to dashboard
  $('#user-login-message').on('click', function(event) {
    chrome.tabs.create({'url': ($(event.target).hasClass("not-logged-in") ?
                               HOST + '/user_session/new' :
                               HOST + '/dashboard') });
  });

  // return a markdown link
  function markdown_link(title, url) {
    return '[' + title.replace('[', '').replace(']', '') + '](' + url.replace('(', '').replace(')', '') + ')'
  }

  // event binding: when pressed #share-this-page-button,
  // put a markdown link of the selected tab to the textarea
  $('#share-this-page-button').on('click', function(e) {
    chrome.tabs.getSelected(null, function(tab) {
      var c = $('#form-content');
      c.val(c.val() + markdown_link(tab.title, tab.url));
      $('#form-content').change();
      toggle_form_submit();
    });
  });

  // post the form
  $('form.form-journal-entry').submit(function(event) {
    var form = $(event.target);

    form.find("#indicator").removeClass("hidden");
    $.post(HOST + '/api/journals/entries.json', {
        content: form.find('#form-content').val()
      },
      function(data, textStatus, jqXHR) {
        $('#form-content').val('');
        toggle_form_submit();
        delete localStorage['gotoknow-express-form-content'];
        form.find("#indicator").addClass("hidden");
        $('#success-message').show().fadeOut(2500);
      },
      "json"
    ).error(function(jqXHR, textStatus, data) {
      $('#success-message').show();
    }).complete(function(jqXHR, textStatus, data) {
      // nothing
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

/*
 * ISSUES
 * ------
 * change isn't triggered when unloaded in Chrome Canary
 */
