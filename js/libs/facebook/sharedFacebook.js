  window.fbAsyncInit = function() {
    FB.init({
      appId      : '109765872836738',
      xfbml      : true,
      version    : 'v2.8'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

    function shareScore(score){
      FB.ui({
        method: 'feed',
        picture:'http://i.imgur.com/QmPZdkH.jpg',
        link:'http://miadventure.x10.mx/',
        caption: 'MI Adventure: TripTime African Adventure',
        quote: "Mi puntuación: " + score,
        hashtag: "#MiAdventure"
      }, function(response){});
  }