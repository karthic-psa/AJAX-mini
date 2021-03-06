
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var strStreet = $('#street').val();
    var strCity = $('#city').val();
    var finalAddress = strStreet + ',' + strCity;
    $greeting.text('Want to live at '+finalAddress+'?');

    var urlStreetview = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location='+finalAddress+'';
    $body.append('<img class="bgimg" src="' + urlStreetview + '">');

    var urlNYTimes = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+strCity+'&sort=newest&api-key=7faec6a4e84d4a1f933f6fb7103f1eeb';
    $.getJSON(urlNYTimes, function(data){
      $nytHeaderElem.text('NYT Articles about '+strCity);
      returnedObj = data.response.docs;
      for (var i = 0; i < returnedObj.length; i++){
        var article = returnedObj[i];
        $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');
      };
    }).error(function(e){
      $nytHeaderElem.text('NYT Articles could not be loaded.');
    });

    var urlWiki = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+strCity+"&format=json&callback=wikiCallback";
    var timeoutWiki = setTimeout(function(){
      $wikiElem.text("wikipedia resources not loaded");}, 8000);
    $.ajax(urlWiki,{
      dataType: "jsonp",
      success: function(response){
        var wikiList = response[1];
        for (var i=0; i< wikiList.length;i++){
          strWiki = wikiList[i];
          var link = 'http://en.wikipedia.org/wiki/'+strWiki;
          $wikiElem.append('<li><a href="'+link+'">'+strWiki+'</a></li>');
        };
        clearTimeout(timeoutWiki);
      }
    });

    return false;
};

$('#form-container').submit(loadData);
