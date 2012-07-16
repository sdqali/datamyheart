var r1 = 600 / 2;
var r0 = r1 - 20;


d3.csv("../real_data.csv", function(csv){
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

    var chord = d3.layout.chord()
        .padding(.05)
        .sortSubgroups(d3.descending)
        .matrix(matrix);

    var width = 700;
    var height = 600;
    var innerRadius = Math.min(width, height) * .41;
    var outerRadius = innerRadius * 1.1;

    var fill = d3.scale.category20();

    var svg = d3.select("#chorddigram")
        .append("svg")
        .attr("class", "chords")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        .attr("height", 700)
        .attr("width", width);

    var g = svg.selectAll("g.group")
        .data(chord.groups)
        .enter().append("svg:g")
        .attr("class", "group");


    g.append("g")
        .selectAll("path")
        .data(chord.groups)
        .enter()
        .append("path")
        .style("fill", function(d) {
            return fill(d.index);
        })
        .style("stroke", function(d) {
            return fill(d.index);
        })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
        .on("mouseover", fade(.1))
        .on("mouseout", fade(1));

    g.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (r0) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) {
            var index = d.index;
            return juices[index].key;
        });

    g.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
            .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            var angle = d.angle * (180 / Math.PI );
            return "rotate(" + (angle  - 88) + ")"
                + "translate(" + (outerRadius + 10) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) {
            var index = d.index;
            return matrix[index][index];
        });

    svg.append("g")
        .attr("class", "chord")
        .selectAll("path")
        .data(chord.chords)
        .enter().append("path")
        .style("fill", function(d) { return fill(d.target.index); })
        .attr("d", d3.svg.chord().radius(innerRadius))
        .on("mouseover", function(d) {
            var source = d.source.index;
            var target = d.target.index;
            //do something meaningful
        })
        .style("opacity", 1);

    /** Returns an array of tick angles and labels, given a group. */
    function groupTicks(d) {
        var k = (d.endAngle - d.startAngle) / d.value;
        return d3.range(0, d.value, 1000).map(function(v, i) {
            return {
                angle: v * k + d.startAngle,
                label: d.value
            };
        });
    }

    /** Returns an event handler for fading a given chord group. */
    function fade(opacity) {
        return function(g, i) {
            svg.selectAll("g.chord path")
                .filter(function(d) {
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style("opacity", opacity);
        };
    }

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
d3.select(self.frameElement).style("height", "960px");
