// create the module and name it
var myApp = angular.module('myApp',[]);

// create the controller and inject Angular's $scope
// we will use this to call methods on this controller to
// switch views

myApp.controller('myController', function($scope) {

    $scope.myData = [
        { name: 'Alice',
            address: '1.1.1.1',
            comment: ''
        },
        { name: 'Bob',
            address: '2.2.2.2',
            comment: "I don't trust Eve"
        },
        { name: 'Eve',
            address: '9.9.9.9',
            comment: "I don't like bob"
        }
    ];

    $scope.form = {};

    $scope.loadRecord = function(rec) {
        // and make a backup for revert purposes
        // if we attach this to the original record
        // we dont lose the scope reference and can handle multiple reverts
        if ( ! rec._orig ) {
            // only do this once to avoid infinite loops
            var orig = angular.copy(rec);
            rec._orig = orig ;
        }

        $scope.form = rec ;
        console.log('click',rec);

    };

    $scope.revert = function(rec) {
        // we can interrogate the current form to get the record and
        // do the revert,

        // and use merge to re-appy the old values
        // use extend since we don't need a deep copy

        // $scope.form = angular.merge( $scope.form , $scope.form._orig );
        $scope.form = angular.extend( $scope.form , $scope.form._orig );
        console.log ( 'revert' , $scope.form );

    };

    // $scope.getDirt = function() {
    //     var dirtMap = {};
    //     angular.forEach($scope.myForm, function(val,key){
    //         if(key[0] == '$') return;
    //         console.log('o',key,val.$dirty);
    //         // if ( obj.$dirty ) {
    //         //     dirtMap[key] = val;
    //         // }
    //
    //     });
    //     return dirtMap;
    // };

});
