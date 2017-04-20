var ordersController = angular.module('ordersController', []);

ordersController.controller('OrderCtrl', ['$scope', '$http', 
  function($scope, $http) {

  	$scope.title= "Order Menu";

  	//Categories ---

  	var aPromise;
  	var itemList, discountList, OrderList, availDisList;


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
			checkSpecials();

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
			checkSpecials();
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
	};

	$scope.checkoutOrder = function () {
		console.log(OrderList);
	};

	//Specials Available

	checkSpecials = function (){

		var item, disItem;

		OrderList.some(function(tempItem){
			item = tempItem;
			for(var i =0; i < discountList.length; i++){
				discountList[i].items.some(function(tempDisItm){
					if(tempDisItm.items_id === item._id){
						disItem = discountList[i];
					}
				});

					if(availDisList.length === 0){
						availDisList.push(disItem);
					}else if(availDisList !== 0){

					availDisList.some(function(tempAvailItem) {
						console.log(tempAvailItem);
							// if(tempAvailItem._id === disItem._id){}
							// else {
							// 	availDisList.push(disItem);
							// }
						});
					}

			}
		});

		if(OrderList === 0){
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

		console.log(availDisList.length);

	};
  
  }]);
