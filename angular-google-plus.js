app.service('Google', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
            var clientId = '800007886348-jf4lphn17vvm3k5rbtkbu6rl9jcl0954.apps.googleusercontent.com',
              apiKey = 'AIzaSyABxuvVtIY-upUIia4UEjqoEdTJpno9WvA',
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


app.run([function() {
            var a = document.createElement("script");
            a.type = "text/javascript", a.async = !0, a.src = "https://js.live.net/v5.0/wl.js";
            var b = document.getElementsByTagName("script")[0];
            b.parentNode.insertBefore(a, b)
}]).service('Live', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {

        var scopesArr = ['wl.signin', 'wl.basic', 'wl.emails','wl.contacts_emails'];

        WL.init({
                client_id: '0000000040157235',
                redirect_uri: 'http://v2.live2times.com/app',
                response_type: "token",
                //logging: true
            });

        this.signUserIn = function() {
            var deferred = $q.defer();
          
            WL.login({ scope: scopesArr }).then(
                function (response) {
                    deferred.resolve(response);
                },
                function(responseFailed){
                    deferred.reject('error');
                }
            );
            return deferred.promise;
        }

        this.loginStatus = function() {
            WL.getLoginStatus(function(response) { 
            alert("response " + response );

            });
        }

        this.getData = function() {
            var deferred = $q.defer();
            WL.api(
                {
                    path: "me/contacts",
                    method: "GET",
                    scope: scopesArr
                },
                    function (result) {

                        if (!result.error) {
                            var resultData = result.data;
                            //console.log('resultData',resultData);

                            var emailHashes = new Array;                    
                            for (i = 0; i < resultData.length; i++) {

                                for (j = 0; j < resultData[i].email_hashes.length; j++) {
                                    alert( "resultData " + resultData[i].email_hashes[j]);
                                    emailHashes[emailHashes.length] = resultData[i].email_hashes[j];
                                }
                            }
                            /*var resultText = "";
                            for (k = 0; k < emailHashes.length; k++) {
                                resultText += emailHashes[k] + "\r\n";                    
                            }*/

                           deferred.resolve(emailHashes);
                        }
                        else {
                            alert("Error getting contacts: " + result.error.message);
                        }
            });

            return deferred.promise;

        }

        this.signUserOut = function() {
            WL.logout();
        }
    }]);
