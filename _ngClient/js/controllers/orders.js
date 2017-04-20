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
		availDisList = [];
	}

	$scope.addToOrder = function (itemId, itemQty) {

		//MUST FIX GETTING QTY VALUE FROM INPUT FIELD!!!

		var temp; var itmQty;

		if(itemQty === undefined){
			itmQty = 1;
		} else { itmQty = 1; }

		if(itemId >=0 && itemId <= itemList.length){

			$scope.items.some(function(item){

				if(item._id === itemId){
					temp = {
						_id: item._id,
						name: (item.name+" "+item.category_id),
						qty: itmQty,
						price: item.price
					}
				}
			});

		}else{
			$scope.discounts.some(function(disItem){
				if(disItem._id === itemId){
					temp = {
						_id: disItem._id,
						name: disItem.title,
						qty: itmQty,
						price: disItem.price
					}
				}
			});
		}

			if(OrderList.length === 0){
						OrderList.push(temp);
					}

				else{

					var exist = false;

				OrderList.some(function(tempChk){

					if(tempChk._id === temp._id)
					{
						index = OrderList.findIndex(x => x._id===temp._id);
						OrderList[index].qty = (tempChk.qty+itmQty);
						exist = true;
					}
				});

				if(!exist){
					OrderList.push(temp);
				}
			}

			$scope.order = OrderList;

			updateCheckoutBtn();

		};

		$scope.removeFromOrder = function (itemId, remQty) {

			var rmvQty;

			if(remQty === undefined){
			rmvQty = 1;
			} else { rmvQty = 1; }

			OrderList.some(function(tempChk){

					if(tempChk._id === itemId)
					{
						index = OrderList.findIndex(x => x._id===itemId);

						if(tempChk.qty === 1){
							OrderList.splice(index, 1);
						} else {
							OrderList[index].qty = (tempChk.qty-rmvQty);
						}
					}
				});

			updateCheckoutBtn();
		};

		$scope.getTemplateOrder = function (order) {
			return 'displayorder';
		};

	//Init Menu

	loadCategories();
	loadItems();
	loadDiscounts();
	initOrder();

	//Handle Checkout

	updateCheckoutBtn = function () {
		var checkoutBtn = document.getElementById("checkoutBtn");
			if(OrderList.length !== 0){
				checkoutBtn.disabled = false;
			}else{ checkoutBtn.disabled = true; }

		checkSpecials();
	};

	$scope.checkoutOrder = function () {
		console.log(OrderList);
	};

	//Specials Available

	checkSpecials = function (){

		var tempDisList = [];
		var availDisList = [];

		OrderList.some(function(tempItem){
			discountList.some(function(discountItem){
				discountItem.items.some(function(tempDisItems){
					if(tempItem._id === tempDisItems.items_id){
						tempDisList.push(discountItem);
					}
				});
			});
		});

		$.each(tempDisList, function(i, e) {
        	if ($.inArray(e, availDisList) == -1) availDisList.push(e);
    	});

    	availDisList.sort(function (a, b) {
 			return a.index - b.index;
		});

		if(OrderList.length === 0){
			availDisList = [];
			$scope.specialavail = availDisList;
		}else{
			$scope.specialavail = availDisList;
		}
	};

	$scope.getTemplateDisAvail = function (specialavail) {
			return 'disavail';
		};

	$scope.updateOrderSpecial = function (itemId) {

		var orderUpdate = $scope.specialavail;

		console.log(orderUpdate.length);

	};
  
  }]);
