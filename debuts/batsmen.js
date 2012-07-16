var w = 900;
var h = 500;
var barPadding = 1;
var padding = 30;
var colorMap = {
    "India": "#1f77b4",
    "Pakistan": "#637939"
};

var batsmenSvg = d3.select("#batsmen")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

function totalRuns(d) {
    return Number(d.performance.Runs);
};

function batAverage(d) {
    return Number(d.performance.BatAv);
};

function highScore(d) {
    return Number(d.performance.HS);
};

function team(d) {
    return d.country;
};

function prettyData(d) {
    return [d.name,
            utils.humanize(d.series),
            "Runs: " + totalRuns(d),
            "Batting Average: " + batAverage(d),
            "High Score: " + highScore(d)]
};

function clearLegend(d) {
    d3.select(".legend")
        .selectAll("li")
        .remove();
};

function sanitizeBatsmen(data) {
    return data.filter(function(d) {
        return !isNaN(totalRuns(d)) &&
            !isNaN(batAverage(d)) &&
            !isNaN(highScore(d)) &&
            totalRuns(d) < 600;
    });
};

d3.json("/debuts/data/debuts.json", function(dataset) {
    dataset = sanitizeBatsmen(dataset);

    var xScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {return totalRuns(d);})])
        .range([2 * padding, w - padding]);

    var yScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function(d) {return batAverage(d);})])
        .range([h - 2 * padding, padding]);

    var radiusScale = d3.scale.sqrt()
        .domain([0, d3.max(dataset, function(d) {return highScore(d);})])
        .range([0, 20]);

    var circles = batsmenSvg.append("g")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {return xScale(totalRuns(d));})
        .attr("cy", function(d) {return yScale(batAverage(d));})
        .attr("r", function(d) {return radiusScale((highScore(d)));})
        .attr("fill", function(d) {
            return colorMap[team(d)];
        })
        .attr("stroke", "white")
        .attr("opacity", 0.6)
        .on("mouseover", function(d){
            d3.select(this)
                .attr("r", function(d) {
                    return radiusScale(highScore(d)) + 5;
                })
                .attr("opacity", "1");
        })
        .on("mouseout", function(d){
            d3.select(this)
                .attr("r", function(d) {return radiusScale(highScore(d));})
                .attr("opacity", 0.6);
            clearLegend();
        })
        .sort(function(a, b) {
            return highScore(b) -  highScore(a);
        });

    circles.append("title")
        .text(function(d) {return prettyData(d);});

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(20)
        .orient("bottom");

    batsmenSvg.append("g")
        .attr("class", "batsmenaxis")
        .attr("transform", "translate(0," + (h - 2 * padding) + ")")
        .call(xAxis);

    batsmenSvg.append("text")
        .text("Total Runs")
        .attr("x", (w - 2 * padding)/2)
        .attr("y", h - padding);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .ticks(10)
        .orient("left");

    batsmenSvg.append("g")
        .attr("class", "batsmenaxis")
        .attr("transform", "translate(" +  2 * padding + ", 0)")
        .call(yAxis);

    var yLabel = batsmenSvg.append("g");
    yLabel.append("text")
        .text("Batting Average")
        .attr("text-anchor", "middle");
    yLabel.attr("transform", "translate(" + padding/2 + "," +  (h - padding)/2 +") rotate(270)");

    var xRule = batsmenSvg.append("g")
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

    var yRule = batsmenSvg.append("g")
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
