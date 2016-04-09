// create the module and name it
var myApp = angular.module('myApp',["chart.js"]);

// create the controller and inject Angular's $scope
// we will use this to call methods on this controller to
// switch views

myApp.controller('myController', function($scope,$filter) {
    $scope.form = {};
    $scope.labels =[];
    $scope.data = [];
    $scope.colors = [ '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'];

    // testing
    $scope.form.left = "22,25 22";
    $scope.form.right = "19,17 19";

    // $scope.data = [
    //     [65, 59, 90, 81, 56, 55, 40],
    //     [28, 48, 40, 19, 96, 27, 100]
    // ];

    $scope.calculate = function() {
        $scope.errors = [];

        console.log('calculate!');

        if ( ! $scope.form.left && ! $scope.form.right) {
            return ;
        }

        // convert into sorted arrays
        var lvals = $filter('orderBy')(
            $scope.form.left.split(/\D/), 'valueOf()' );
        var rvals = $filter('orderBy')(
            $scope.form.right.split(/\D/), 'valueOf()' );

        $scope.labels = [];
        for (var i = 1; i <= lvals.length; ++i) $scope.labels.push(i);

        // console.log( lvals, rvals);

        $scope.data = [ lvals , rvals ];

        // return $scope.records ;
        // return records ;
        // return [] ;
    };

    // testing
    $scope.calculate();

});
