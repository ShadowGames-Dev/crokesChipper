var crokesChipper = angular.module("crokesChipper", ['ngRoute', 'nrzLightify',
     'appGlobalController',  'ngResource' ]);

crokesChipper.run(function( ) {

});

crokesChipper.config(['$routeProvider','$httpProvider', '$provide',  '$locationProvider',
      function($routeProvider, $httpProvider, $provide,  $locationProvider ) {	 
	  
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];	  
 
			$routeProvider.					
					  when('/home', {
						templateUrl: './partials/home.html',
						controller: 'HomeCtrl'
					  }).	 	 						
					  otherwise({
						redirectTo: '/home'
					  });
 			
  }]);