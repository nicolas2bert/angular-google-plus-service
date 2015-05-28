# angular-google-plus-service
angular-google-plus-service : a really simple angular service which handles the login with Google Plus

### Instalation

##### 1) Download the package: download using the zip file 

##### 2) Add angular-plus-service.js in your app & Change the clientId, apiKey & scopes

```
// Initialization of module
 var clientId = 'YOUR_CLIENT_ID',
  apiKey = 'YOUR_API_KEY',
  scopes = [/*'https://www.googleapis.com/auth/plus.login',*/'https://www.googleapis.com/auth/contacts.readonly'],

```

##### 3) Inject the ```Google``` service into your ```HelloCtrl``` controller

```
  <div ng-controller="HelloCtrl" class="container">
    <a ng-click="login();">Login Google +</a>
  </div>
```

```
var app = angular.module("app", []);
    app.controller("HelloCtrl", function($scope,Google) {
      $scope.login = function () {
        Google.login().then(function(response){
          alert(JSON.stringify(response));
        });
      };
});
```


#### 4) Enjoy your Google Plus API
