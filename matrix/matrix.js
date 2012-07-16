var margin = {top: 80, right: 0, bottom: 10, left: 80};
var width = 720;
var height = 720;

var x = d3.scale.ordinal().rangeBands([0, width]);
var z = d3.scale.linear().domain([0, 4]).clamp(true);
var c = d3.scale.category10().domain(d3.range(10));

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("../real_data.csv", function(csv) {
    var data=csv;

    var parse = d3.time.format("%Y-%m-%d").parse;

    data.forEach(function(s) {
        s.date = parse(s.date);
    })

    var juices=d3.nest()
        .key(function(d) {return d.juice;})
        .key(function(d) {return d.emp_id;})
        .rollup(function(d) {return d.length;})
        .entries(data);


    juices.forEach(function(j) {
        j.values = j.values.map(function(v) {
            return v.key;
        });
    });

    var matrix = [];
    for(i = 0; i < juices.length; i++) {
        matrix[i] = new Array(juices.length);
    }

    var m = 0;
    juices.forEach(function(i){
        var j1 = d3.values(i)[1];
        var n = 0;
        juices.forEach(function(j){
            var j2 = d3.values(j)[1];
            var common = commonElements(j1, j2);
            matrix[m][n] = common.length;
            matrix[n][m] = common.length;
            n++;
        });
        matrix[m][m] = elementsInAButNotInRest(j1, juices).length;
        m++;
    });

    function commonElements(a1, a2) {
        var common = []
        a1.forEach(function(e1){
            a2.forEach(function(e2) {
                if(e1 == e2){
                    common.push(e1)
                }
            });
        });
        return common;
    }

    function elementsInAButNotInRest(j1, juices) {
        var uniques = [];
        juices.forEach(function(j) {
            row = d3.values(j)[1];
            if(row != j1) {
                commonElements(j1, row).forEach(function(elem) {
                    uniques.push(elem);
                });
            }
        });
        return getUnique(uniques);
    }

    function getUnique(array) {
        var result = [];
        array.forEach(function(item) {
            if(result.indexOf(item) == -1) {
                result.push(item);
            }
        });
        return result;
    }

});
