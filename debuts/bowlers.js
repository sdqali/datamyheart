var w = 900;
var h = 500;
var barPadding = 1;
var padding = 30;
var colorMap = {
    "India": "#1f77b4",
    "Pakistan": "#637939"
};

var bowlersSvg = d3.select("#bowlers")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

function bowlAv(d) {
    return Number(d.performance.BowlAv);
};

function wickets(d) {
    return Number(d.performance.W);
};

function bestBowling(d) {
    return Number(d.performance.BB.split("/")[0]);
};

function team(d) {
    return d.country;
};

function prettyData(d) {
    return [d.name,
            utils.humanize(d.series),
            "Bowling Average: " + bowlAv(d),
            "Wickets: " + wickets(d),
            "Best Bowling: " + d.performance.BB]
};

function writeLegend(data) {
    clearLegend(data);
    d3.select(".legend")
        .selectAll("ul")
        .attr("class", "foo")
        .data(prettyData(data))
        .enter()
        .append("li")
        .text(function(stat) {
            return stat;
        });
};

function clearLegend(d) {
    d3.select(".legend")
        .selectAll("li")
        .remove();
};

function sanitizeBowlers(data) {
    return data.filter(function(d) {
        return d.performance.W > 0 && d.performance.BowlAv < 110;
    });
};

d3.json("/debuts/data/debuts.json", function(dataset) {
    dataset = sanitizeBowlers(dataset);

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {return bowlAv(d);})])
        .range([2 * padding, w - padding]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {return wickets(d);})])
        .range([h - 2 * padding, padding]);

    var radiusScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {return bestBowling(d);})])
        .range([0, 20]);

    var circles = bowlersSvg.append("g")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {return xScale(bowlAv(d));})
        .attr("cy", function(d) {return yScale(wickets(d));})
        .attr("r", function(d) {return radiusScale((bestBowling(d)));})
        .attr("fill", function(d) {
            return colorMap[team(d)];
        })
        .attr("stroke", "white")
        .attr("opacity", 0.6)
        .on("mouseover", function(d){
            d3.select(this)
                .attr("r", function(d) {
                    return radiusScale(bestBowling(d)) + 5;
                })
                .attr("opacity", "1");
            writeLegend(d);
        })
        .on("mouseout", function(d){
            d3.select(this)
                .attr("r", function(d) {return radiusScale(bestBowling(d));})
                .attr("opacity", 0.6);
            clearLegend();
        })
        .sort(function(a, b) {
            return bestBowling(b) -  bestBowling(a);
        });

    circles.append("title")
        .text(function(d) {return prettyData(d);});

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(20)
        .orient("bottom");

    bowlersSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - 2 * padding) + ")")
        .call(xAxis);

    bowlersSvg.append("text")
        .text("Bowling Average")
        .attr("x", (w - 2 * padding)/2)
        .attr("y", h - padding);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(10)
        .orient("left");

    bowlersSvg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" +  2 * padding + ", 0)")
        .call(yAxis);

    var yLabel = bowlersSvg.append("g");
    yLabel.append("text")
        .text("Wickets")
        .attr("text-anchor", "middle");
    yLabel.attr("transform", "translate(" + padding/2 + "," +  (h - padding)/2 +") rotate(270)");

    var xRule = bowlersSvg.append("g")
        .selectAll(".rule")
        .data(yScale.ticks(10))
        .enter()
        .append("g")
        .attr("class", "rule")
        .attr("transform", function(d) {
            return "translate(" + 2 * padding + ", " + yScale(d) + ")";
        });

    xRule.append("line")
        .attr("x2", w - 3 * padding);

    var yRule = bowlersSvg.append("g")
        .selectAll(".rule")
        .data(xScale.ticks(20))
        .enter()
        .append("g")
        .attr("class", "rule")
        .attr("transform", function(d) {
            return "translate(" + xScale(d) + "," + padding + ")";
        });

    yRule.append("line")
        .attr("y2", h - 3 * padding);
});
