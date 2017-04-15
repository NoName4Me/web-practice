function jsonp(json) {
  var data = json.query.pages;
  var keys = Object.keys(data);
  keys.forEach(x => {
    var div = document.createElement('div'),
      h2 = document.createElement('h2'),
      p = document.createElement('p');
    h2.textContent = data[x].title;
    p.textContent = data[x].extract;
    $(div).addClass("result-card").append($('<a href="' + 'https://en.wikipedia.org/?curid=' + x + '" target="_blank"></a>').append(h2).append(p));
    $('.results').append(div);
  });

  $('.results').show();
}

function doSearch(val) {
  var script = document.createElement('script');
  script.src = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=" + val + "&callback=jsonp";
  $('head').append(script);

}

function showForm() {
  $('#search-form').show();
  $('input').focus();
  $(this).hide();
}

function dismissForm() {
  $('#search-form').hide();
  $('.results').hide();
  $('.btn-search').show();
  $('input').val("");
}

$(document).ready(function() {
  $('.btn-search').on('click', showForm);
  $('.btn-close').on('click', dismissForm);
  $('input').bind('keydown', function(event) {
    if (event.keyCode == "13") {
      doSearch(this.value);
    }
  });
});
