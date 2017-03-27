var ordersController = angular.module('ordersController', []);

ordersController.controller('OrderCtrl', ['$scope', '$http', 
  function($scope, $http) {

  	$scope.title= "Order Menu";

  	//Categories ---

  	var aPromise;

  	$scope.loadCategories = function() 
		{ 
		    $scope.asynchWait = true;
			displayCategories({});
			$scope.asynchWait = false;			 
		}

		function getCategories()
		{
        	return $http.post('/api/categories'); 			
		}		
		
		function displayCategories(filters)
		{ 		
			aPromise = getCategories(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.categories = response.data;
						  },
						  function error(error)
						  {
							  $scope.categories = [];					  
						  });
		}

		$scope.getTemplateCategorys = function (category) {
			return 'displaycategory';
		};

  	//ITEMS ---

  	$scope.loadItems = function() 
		{ 
		    $scope.asynchWait = true;
			displayItems({});
			$scope.asynchWait = false;			 
		}

		function getItems()
		{
        	return $http.post('/api/items'); 			
		}		
		
		function displayItems(filters)
		{ 		
			aPromise = getItems(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.items = response.data;
						  },
						  function error(error)
						  {
							  $scope.items = [];					  
						  });
		}

		$scope.getTemplateItems = function (item) {
			return 'displayitem';
		};

	//Discounts ---

	$scope.loadDiscounts = function() 
		{ 
		    $scope.asynchWait = true;
			displayDiscounts({});
			$scope.asynchWait = false;			 
		}

		function getDiscounts()
		{
        	return $http.post('/api/discounts'); 			
		}		
		
		function displayDiscounts(filters)
		{ 		
			aPromise = getDiscounts(filters);
			
			aPromise.then(function(response) 
						  {
							$scope.discounts = response.data;
						  },
						  function error(error)
						  {
							  $scope.discounts = [];					  
						  });
		}

		$scope.getTemplateDiscounts = function (discount) {
			return 'displaydiscount';
		};
  
  }]);