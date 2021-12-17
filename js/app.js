var myApp = angular.module('myApp', []);
myApp.controller('myController', function ($scope, $http, $q, $filter) {

    $scope.games = [];
    // $scope.winnersSummary = [];

    $scope.init = function () {
        getData();
    }

    getData = () =>  {
        var file = 'data/games.json';

        $http.get(file)
        .then(function(response) {
            $scope.games = response.data.games;
            $scope.generatePivot();
            $scope.generateSummary();
        });
    };

    $scope.generateSummary = () => {
        var obj = $scope.games.flatMap(game => game.players.filter(player => player.winner === true));
        var result = [];
        Array.from(new Set(obj.map(x => x.name))).forEach(x => {
            result.push(obj.filter(y => y.name === x).reduce((output,item) => {
                let val = output[x] === undefined?0:output[x];
                output[x] =  (item.winner +  val); 
                return output;
            },{}));
        });
        console.log(result);
        $scope.winnersSummary = result;

        result.forEach((a, i) =>
            console.log(i, [{ key: Object.keys(a) }, { val: Object.values(a) }])
        )
    }

    $scope.generatePivot = () => {
        
        $scope.data = $scope.games.map(game => game.players.filter(player => player.winner === true));
        
        var data = [].concat.apply([], $scope.data);
        
        if ($scope.ui) {
            $("#output").pivotUI(
                data,
                {
                    rows: ["name"],
                    cols: ["score"]
                }
            );
        } else {
            $("#output").pivot(
                data,
                {
                    rows: ["name"],
                    cols: ["score"]
                }
            );
        }

    }

    $scope.init();
});