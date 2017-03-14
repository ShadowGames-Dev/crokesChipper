var crokesChipper = angular.module("crokesChipper", ['ngRoute', 'nrzLightify',
     'appGlobalController',  'ngResource' ]);

crokesChipper.run(function( ) {

});

//FIX ROUTE ISSUE WITH MENU AND ANY ADDITIONAL PAGES!!!

crokesChipper.config(['$routeProvider','$httpProvider', '$provide',  '$locationProvider',
      function($routeProvider, $httpProvider, $provide,  $locationProvider ) {	 
	  
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];	  
 
			$routeProvider.					
					  when('/home', {
						templateUrl: './partials/home.html',
						controller: 'HomeCtrl'
					  }).	
					  when('/menu', {
						templateUrl: './partials/menu.html',
						controller: 'MenuCtrl'
					  }).	 						
					  otherwise({
						redirectTo: '/menu'
					  });

			//$locationProvider.html5Mode(true); removes # in URL, breaks routes 
 			
  }]);