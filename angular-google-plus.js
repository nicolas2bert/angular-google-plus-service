app.service('Google', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
            var clientId = 'YOUR_CLIENT_ID',
              apiKey = 'YOUR_API_KEY',
              scopes = [/*'https://www.googleapis.com/auth/plus.login',*/'https://www.googleapis.com/auth/contacts.readonly'],
              deferred = $q.defer();
 
            this.login = function () {
                gapi.auth.authorize({ 
                    client_id: clientId, 
                    scope: scopes, 
                    immediate: false
                }, this.handleAuthResult);
 
                return deferred.promise;
            }
 
            this.handleClientLoad = function () {
                gapi.client.setApiKey(apiKey);
                gapi.auth.init(function () { });
                window.setTimeout(checkAuth, 1);
            };
 
            this.checkAuth = function() {
                gapi.auth.authorize({ 
                    client_id: clientId, 
                    scope: scopes, 
                    immediate: true
                }, this.handleAuthResult);
            };
 
            this.handleAuthResult = function(authResult) {
                if (authResult && !authResult.error) {
                  deferred.resolve(authResult);
                } else {
                  deferred.reject('error');
                }
            };

            this.getUser = function() {
                var deferred = $q.defer();

                gapi.client.load('oauth2', 'v2', function () {
                  var request = gapi.client.oauth2.userinfo.get();
                    request.execute(function (resp) {
                    data = resp;
                    deferred.resolve(data);
                  });
                });

                return deferred.promise;
            };

            /*this.getContacts = function(token) {
                var deferred = $q.defer();
                $.ajax({
                    url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json',
                    dataType: 'jsonp',
                    data: token
                  }).done(function(data) {
                  console.log(JSON.stringify(data));
                  //deferred.resolve(data);
                });
            };*/

            this.getContacts = function(access_token) {
                var deferred = $q.defer();
                $.ajax({
                    url: "https://www.google.com/m8/feeds/contacts/default/full?access_token=" + access_token + "&alt=json",
                    dataType: "jsonp",
                    success:function(data) {
                      var infos = data.feed.entry;
                      var mails = [];
                      for (i = 0; i < infos.length; i++) {
                        if (infos[i]['gd$email'][0]['address']) {
                          mails.push(infos[i]['gd$email'][0]['address']);
                        }; 
                      }
                      deferred.resolve(mails);
                    }
                });
                return deferred.promise;
            }
 
            this.handleAuthClick = function(event) {
                gapi.auth.authorize({ 
                    client_id: clientId, 
                    scope: scopes, 
                    immediate: false, 
                }, this.handleAuthResult);
                return false;
            };
 
 }]).run([function() {
    var a = document.createElement("script");
    a.type = "text/javascript", a.async = !0, a.src = "https://apis.google.com/js/client.js";
    var b = document.getElementsByTagName("script")[0];
    b.parentNode.insertBefore(a, b)
}]);


