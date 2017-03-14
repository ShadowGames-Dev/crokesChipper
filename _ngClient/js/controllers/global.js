var appGlobalController = angular.module('appGlobalController', []);
 
appGlobalController.controller('HomeCtrl', ['$scope' ,
		function($scope) {
			
			$scope.title= "Crokes POS Login";
	 
		}]);
	
 
	
appGlobalController.controller('MenuCtrl', ['$scope', 
  function($scope) {

  	$scope.title= "Crokes Menu";
  
  }]);