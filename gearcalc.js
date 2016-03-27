// create the module and name it
var myApp = angular.module('myApp',[]);

// create the controller and inject Angular's $scope
// we will use this to call methods on this controller to
// switch views

myApp.controller('myController', function($scope) {
    $scope.form = {};

    $scope.calculate = function() {
        // var records = {};
        var records = [];

        if ( $scope.form.front && $scope.form.rear) {
            var fvals = $scope.form.front.split(/\D/);
            var rvals = $scope.form.rear.split(/\D/);

            // console.log( 'fv', fvals, rvals);

            // inner and outer loops
            angular.forEach(fvals, function(fv){
                angular.forEach(rvals, function(rv){
                    var rec = {};
                    rec.fg = fv ;
                    rec.rg = rv ;

                    // console.log( rec );
                    // var ratio = fv/rv ;
                    // records[ratio] = rec ;

                    records.push(rec) ;

                });
            });

        }

        console.log( records );

        return records ;
        // return [] ;
    };

});
