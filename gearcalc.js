// create the module and name it
var myApp = angular.module('myApp',[]);

// create the controller and inject Angular's $scope
// we will use this to call methods on this controller to
// switch views

myApp.controller('myController', function($scope,$filter) {
    $scope.form = {};
    $scope.records = [];
    $scope.errors = [];

    // testing
    $scope.form.front = "44,32,22";
    $scope.form.rear = "11,13,15,17,20,23,26,30,34";

    // some lookuptables
    var gearColors = [
        'progress-bar-success',
        'progress-bar-info',
        'progress-bar-danger',
    ];

    $scope.calculate = function() {
        // var records = {};
        var gearData = [];
        $scope.errors = [];

        if ( ! $scope.form.front && ! $scope.form.rear) {
            return gearData;
        }

        // convert into sorted arrays
        var fvals = $filter('orderBy')(
            $scope.form.front.split(/\D/), 'valueOf()' );
        var rvals = $filter('orderBy')(
            $scope.form.rear.split(/\D/), 'valueOf()' );

        // var fvals = $scope.form.front.split(/\D/);
        // var rvals = $scope.form.rear.split(/\D/);

        // console.log( 'fv', fvals, rvals)

        // track boundaries, mins and maximums for further filtering
        var fMaxIdx = 0;
        var rMaxIdx = 0;

        // inner and outer loops
        angular.forEach(fvals, function(fv,fidx){
            angular.forEach(rvals, function(rv,ridx){
                // do some calculations
                // we will use the simple gear ratio for the present
                var myRatio = $filter('number')(fv/rv, 2);

                // then we track the lever index for the shift pattern
                fMaxIdx = fidx;
                rMaxIdx = ridx ;

                // create a record of data
                var rec = {
                    ratio: myRatio,
                    fidx : fidx +1,
                    ridx : ridx +1,
                    rearViewSize : ~~((rv-5)/35*100),
                    rearViewColor : gearColors[fidx],
                    front: fv,
                    rear: rv

                };
                // rec.fg = fv ;
                // rec.rg = rv ;

                // console.log( rec );
                // var ratio = fv/rv ;
                // records[ratio] = rec ;

                gearData.push(rec) ;

            });
        });

        fMaxIdx ++ ;
        rMaxIdx ++ ;

        // console.log ( 'maxidx', fMaxIdx , rMaxIdx );

        // now sort the array
        var sorted = $filter('orderBy')( gearData,'+ratio' , $scope.form.reverse );

        // console.log ( 's', $scope.form.reverse );

        // then walk the array and remove anything that matches our rules
        // as well as calculating the gain ratios

        var usable = [];
        var lastRatio ;
        var fLast ;
        var rLast ;


        angular.forEach(sorted, function(rec,idx){

            // look for crossed chains
            // for REAR 1 == high/small
            // for FRONT 1 == Low/small
            // don't go more than N sprockets past the edge
            // assume 6
            var isCrossed = 0 ;

            if ( rec.fidx == 1  && rec.ridx <= ( rMaxIdx - 5)) {
                // f-low r-high
                isCrossed ++ ;
            }

            if ( rec.fidx == 2  && rec.ridx >= rMaxIdx - 1 ) {
                // middle or high ring,
                // just skip 2 lowest gears
                // f-high r-low
                isCrossed ++ ;
            }

            if ( rec.fidx == 2 &&
                fMaxIdx == 3  && rec.ridx <= 3 ) {
                // middle ring 3 speed front groupset
                // f-mid, r-high
                isCrossed ++ ;
            }

            if ( rec.fidx == 3  && rec.ridx >= rMaxIdx - 2 ) {
                // 3 speed front groupset,
                // f-high r-low
                isCrossed ++ ;
            }

            if ( isCrossed ) {
                rec.crossWarning = 'danger';
                // console.log ('cross : ', rec) ;
                if ( $scope.form.cross ) {
                    $scope.errors.push('cross chain '+rec.front+','+rec.rear +
                    ' : ' + rec.fidx + ',' + rec.ridx );
                    return ;
                }
            }

            if ( lastRatio ) {
                var gain = 100 * ( rec.ratio - lastRatio ) / rec.ratio ;
                if ( $scope.form.reverse ) {
                    gain *= -1 ;
                }
                rec.gain = Number($filter('number')(gain, 0));

                rec.gainWarning = rec.gain <= 4.5 ? "danger" : "" ;

                // drop ratios lower than threshold
                // if ( $scope.form.threshold  && rec.gain ) {
                if ( $scope.form.threshold ) {
                    var thresh = Number($scope.form.threshold);
                    // console.log ('th check', rec.gain , thresh );
                    if ( rec.gain <= $scope.form.threshold ) {
                        $scope.errors.push('under thresh '+rec.front+','+rec.rear +
                        ' : ' + rec.fidx + ',' + rec.ridx );
                        // console.log ( 'drop thresh' , $scope.form.threshold, rec );
                        return ;

                    }

                }
            }

            if ( fLast ) {
                rec.fShift = rec.fidx - fLast ;
                rec.fShift = rec.fShift === 0 ? "" : rec.fShift ;
            }
            if ( rLast ) {
                rec.rShift = rec.ridx - rLast ;
            }
            fLast = rec.fidx ;
            rLast = rec.ridx ;

            lastRatio = rec.ratio;
            usable.push( rec );

        }); //end foreach

        // console.log( records );
        $scope.records = usable ;

        return $scope.records ;
        // return records ;
        // return [] ;
    };

    // testing
    $scope.calculate();

});
