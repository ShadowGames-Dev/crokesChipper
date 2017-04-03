var ordersController = angular.module('ordersController', []);

ordersController.controller('OrderCtrl', ['$scope', '$http', 
  function($scope, $http) {

  	$scope.title= "Order Menu";

  	//Categories ---

  	var aPromise;
  	var itemList, discountList, OrderList;

  	loadCategories = function() 
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

		$scope.getTemplateCategoryItems = function (category) {
			return 'displaycategoryitems';
		};

  	//ITEMS ---

  	loadItems = function() 
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
							itemList = response.data;
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

	loadDiscounts = function() 
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
							discountList = response.data;
						  },
						  function error(error)
						  {
							  $scope.discounts = [];					  
						  });
		}

		$scope.getTemplateDiscounts = function (discount) {
			return 'displaydiscount';
		};

	//Handle Orders

	initOrder = function(){
		OrderList = [];
	}

	$scope.addToOrder = function (itemId) {

			$scope.items.some(function(item){

				var temp = {
						_id: item._id,
						name: (item.name+" "+item.category_id),
						qty: 1,
						price: item.price
					}

				if(item._id == itemId && OrderList == 0){
						OrderList.push(temp);
					}

				else if(item._id == itemId){

				OrderList.some(function(tempChk){
					if(tempChk._id == temp._id)
					{
						temp = {
							_id: tempChk._id,
							name: tempChk.name,
							qty: (tempChk.qty++),
							price: tempChk.price
						}
						//index = OrderList.findIndex(x => x._id==temp._id);
						//console.log(index);
						//OrderList[index] = temp
					}else {
						OrderList.push(temp);
					}
				});
			}

			});

			$scope.order = OrderList;

		};

		$scope.getTemplateOrder = function (order) {
			return 'displayorder';
		};

	//Init Menu

	loadCategories();
	loadItems();
	loadDiscounts();
	initOrder();

  
  }]);
