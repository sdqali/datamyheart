var punchCardWidth = 800;
var punchCardHeight = 600;
var padding = 30;

d3.json("../punch_card/commits.json", function(dataset) {
    var punchCardPlot = d3.select("#punchcard")
        .append("svg")
        .attr("width", punchCardWidth)
        .attr("height", punchCardHeight);

    var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var hours = [];
    for(var i = 0; i < 24; i++) {
        hours.push(twoDigits(i));
    }

    var xScale = d3.scale.linear()
        .domain([0, 23])
        .range([2 * padding, punchCardWidth - padding]);

    var yScale = d3.scale.linear()
        .domain([0, 6])
        .range([punchCardHeight - 2 * padding, padding]);

    var radiusScale = d3.scale.sqrt()
        .domain([0, d3.max(dataset, function(d) {return d.count;})])
        .range([0, 18]);


    var circles = punchCardPlot.append("g")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return xScale(hours.indexOf(d.hour));
        })
        .attr("cy", function(d) {
            return yScale(days.indexOf(d.day));
        })
        .attr("r", function(d) {return radiusScale(d.count);})
        .attr("fill", function(d) {
            return "teal";
        })
        .attr("stroke", "white")
        .attr("opacity", 0.8)
        .attr("shape-rendering", "geometricPrecision")
        .on("mouseover", function(d){
            d3.select(this)
                .attr("r", function(d) {
                    return radiusScale(d.count) + 5;
                })
                .attr("opacity", "1");
        })
        .on("mouseout", function(d){
            d3.select(this)
                .attr("r", function(d) {return radiusScale(d.count);})
                .attr("opacity", 0.8);
        })
        .sort(function(a, b) {
            return b.count -  a.count;
        });

    circles.append("title")
        .text(function(d) {return d.count + ", " + d.day + ", " + d.hour;});

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(hours.length)
        .tickFormat(function(h) {
            return hours[h];
        })
        .orient("bottom");

    punchCardPlot.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (punchCardHeight - 1.5 * padding) + ")")
        .call(xAxis);

    var xLabel = punchCardPlot.append("g");
    xLabel.append("text")
        .text("Hour")
        .attr("x", (punchCardWidth - 2 * padding)/2)
        .attr("y", punchCardHeight - padding/2);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(days.length)
        .tickFormat(function(d) {
            return days[d];
        })
        .orient("left");

    punchCardPlot.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" +  1.75 * padding + ", 0)")
        .call(yAxis);

    var yLabel = punchCardPlot.append("g");
    yLabel.append("text")
        .text("Day")
        .attr("text-anchor", "middle");
    yLabel.attr("transform", "translate(" + padding/2 + "," +  (punchCardHeight - padding)/2 +") rotate(270)");

    var xRule = punchCardPlot.append("g")
        .selectAll(".rule")
        .data(yScale.ticks(10))
        .enter()
        .append("g")
        .attr("class", "rule")
        .attr("transform", function(d) {
            return "translate(" + 2 * padding + ", " + yScale(d) + ")";
        });

    xRule.append("line")
        .attr("x2", punchCardWidth - 3 * padding);

    var yRule = punchCardPlot.append("g")
        .selectAll(".rule")
        .data(xScale.ticks(20))
        .enter()
        .append("g")
        .attr("class", "rule")
        .attr("transform", function(d) {
            return "translate(" + xScale(d) + "," + padding + ")";
        });

    yRule.append("line")
        .attr("y2", punchCardHeight - 3 * padding);

    function twoDigits(num) {
        if(num < 10) {
            return "0" + num.toString() + ":00";
        } else {
            return num.toString() + ":00";
        }
    }
});
