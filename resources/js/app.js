var app = angular.module('SimpTekApp',[], function($routeProvider, $locationProvider) {
	'use strict';

	$routeProvider
	.when('/', {
		templateUrl: 'home.html',
		controller: 'HomeCtrl'
	})
	.when('/modal', {
		templateUrl: 'modal.html',
		controller: 'ModalCtrl'
	})

	$locationProvider.html5Mode({ // get rid of hashbang
		enabled: true,
		requireBase: false
	});
});

/******** SERVICES ******** */
app.service('backendService', function($http) {
	this.getData = function() { // making request using server to avoid OPTIONS pre-flight call in browser which does not ever include Authorization header
		var config = {
			method: 'GET',
			url: '/get-data'
		};

		return $http(config);
	}
});

/******** CONTROLLERS ******** */
app.controller('HomeCtrl', function ($rootScope) {
	$rootScope.pageTitle = 'Home';
	$rootScope.currentPage = 'home';
});

app.controller('ModalCtrl', function($scope, $rootScope, backendService) {
	$rootScope.pageTitle = 'Modal';
	$rootScope.currentPage = 'modal';
	$scope.predicate = 'name';
	$scope.reverse = true;

	$scope.search = function(row) {
		if (!$scope.keywords || (row.name.toLowerCase().indexOf($scope.keywords.toLowerCase()) !== -1) || (row.address.toLowerCase().indexOf($scope.keywords.toLowerCase()) !== -1)) return true;

		return false;
	}

	$scope.orderResultsBy = function(column) {
		$scope.predicate = column;

		if ($scope.reverse) {
			$scope.reverse = false;
		} else {
			$scope.reverse = true;
		}
	}

	$scope.setClass = function(column) {
		var className = 'oi';

		if ($scope.predicate === column) className += $scope.reverse ? ' oi-chevron-bottom' : ' oi-chevron-top' ;

		return className;
	}

	$scope.viewData = function() {
		showBlocker();


		backendService.getData()
		.success(function(resp) {
			$scope.results = resp;
		})
		.error(function(resp) {
			console.log(resp);
		});
	}


	// animation stuff
	var blocker = document.querySelector('.modal-blocker');
	var dataTable = document.querySelector('.modal-data-table');

	function showBlocker() {
		blocker.classList.add('modal-open');
		blocker.addEventListener('animationend', showDataTable);
	}

	function showDataTable() {
		dataTable.classList.add('modal-open');
		blocker.removeEventListener('animationend', showDataTable);
	}

	function hideDataTable() {
		dataTable.classList.add('modal-close');
		dataTable.addEventListener('animationend', hideBlocker);
	}

	function hideBlocker() {
		dataTable.classList.remove('modal-close', 'modal-open');
		dataTable.removeEventListener('animationend', hideBlocker);

		blocker.classList.add('modal-close');
		blocker.addEventListener('animationend', resetBlocker);
	}

	function resetBlocker() {
		blocker.classList.remove('modal-close', 'modal-open');
		blocker.removeEventListener('animationend', resetBlocker);
	}

	$scope.closeModal = function() {
		hideDataTable();
	}
});
