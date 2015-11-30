angular.module('myApp.requests', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/requests', {
    authenticate: true,
    templateUrl: 'view/requests/requests.html',
    controller: 'requestsPage',
    resolve: {
      getUserDemands: ['userRequests', function(userRequests) {
          return userRequests.getDemands();
      }],
      getUserRequests: ['userRequests', function(userRequests) {
          return userRequests.getRequests();
      }]
    }
  });
}])

.controller('requestsPage', [
  '$scope', 'getUserDemands', 'getUserRequests', 'socket', 'Cookie', '$cookies', 'UserConnection', '$window', '$rootScope', '$location', '$timeout', 
  function($scope, getUserDemands, getUserRequests, socket, Cookie, $cookies, UserConnection, $window, $rootScope, $location, $timeout) {

  var userDemands = getUserDemands;
  console.log('demands: ',userDemands);
  var usersRequest = getUserRequests;
  console.log('requests: ',usersRequest);

  // Get User username
  var cookie = $cookies.get('gitConnectDeltaKS');
  var cookieObj = Cookie.parseCookie(cookie);
  var userUsername = cookieObj.username;

  $scope.usersRequest = usersRequest;
  $scope.userDemands = userDemands;

  $scope.ratings = function(ratings, index, type) {
    // Ratings Module
    index = index + 2;
    $ratings = $('.user-details.' + type + ':nth-child(' + index + ') .stars');
    for (var pos = 0; pos < 5; pos++) {
      $ratings.append("<i class='fa fa-star-o position-" + pos + "'></i>");
    }
    for (var i = 0; i < ratings; i++) {
      $('.user-details.' + type + ':nth-child(' + index + ') .position-' + i).removeClass('fa-star-o').addClass('fa-star');
    }
  };


  $scope.requestAccept = function(username) {
    console.log('project creation');
    var usersObject = {
      userFirst: userUsername,
      userSecond: username
    };
    
    UserConnection.createConnection(usersObject).then(function(project) {
      $scope.linktoProject = project.projectId;
      $('#projectPageRedirect').modal('show');

    });
  };

  $scope.deleteRequest = function(username) {
    console.log('Delete Request');
    var usersObject = {
      userFirst: userUsername,
      userSecond: username
    };
    
    UserConnection.deleteRequest(usersObject).then(function() {
      $('.requests.'+ username).slideUp();
    });
  };

  $scope.deleteDemand = function(username) {
    console.log('Delete Request');
    var usersObject = {
      userFirst: userUsername,
      userSecond: username
    };
    
    UserConnection.deleteDemand(usersObject).then(function() {
      $('.demands.'+username).slideUp();
    });
  };

  $scope.projectRedirect = function(id) {
    $('#projectPageRedirect').modal('hide');

    $timeout(function() {
      $rootScope.$broadcast('projectStarted', {projectId: id});
    }, 1000);

    // window.location = '#/collaboration-page/' + id;
    // window.location.reload();
  }

}]);