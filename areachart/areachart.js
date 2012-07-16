function drawAreaChart() {

    var w = 800,
    h = 600,
    p = [20, 50, 30, 20],
    x = d3.scale.ordinal().rangeRoundBands([0, w - p[1] - p[3]]),
    y = d3.scale.linear().range([0, h - p[0] - p[2]]),
    z = d3.scale.category20();
    parse = d3.time.format("%Y-%m-%d").parse,
    format = d3.time.format("%b");

    var svg = d3.select("#areachart")
        .append("svg")
        .attr("class", "areachartsvg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(" + p[3] + "," + (h - p[2]) + ")");

    d3.csv("../areachart/areachart.csv", function(data) {
        juice_types = ["Musambi", "Watermelon", "Dates", "Banana", "Grapes", "Chikku", "Lime", "Pineapple", "Orange", "Musk Melon", "Mixed Fruit", "Apple", "Papaya", "Mango"]

        // Transpose the data into layers by cause.
        var juices = d3.layout.stack()(juice_types.map(function(jt) {
            return data.map(function(d) {
                var sum = 0;
                juice_types.forEach(function(jt) {
                    sum += +d[jt];
                });
                var perc = 0;
                if(sum != 0) {
                    perc = +d[jt] * 100 / sum;
                }
                return {x: d.day, y: perc};
            });
        }));

        // Compute the x-domain (by date) and y-domain (by top).
        x.domain(juices[0].map(function(d) { return d.x; }));
        y.domain([0, d3.max(juices[juices.length - 1], function(d) { return d.y0 + d.y; })]);


        // Add a label per date.
        var label = svg.selectAll("text")
            .data(x.domain())
            .enter().append("svg:text")
            .attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
            .attr("y", 6)
            .attr("text-anchor", "middle")
            .attr("dy", ".71em")
            .text(function(d) {return d;});

        // Add y-axis rules.
        var rule = svg.selectAll("g.rule")
            .data(y.ticks(5))
            .enter().append("svg:g")
            .attr("class", "rule")
            .attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });

        rule.append("svg:line")
            .attr("x2", w - p[1] - p[3])
            .style("stroke", function(d) { return d ? "#dedede" : "#000"; })
            .style("stroke-opacity", function(d) { return d ? .7 : null; });

        rule.append("svg:text")
            .attr("x", 0)
            .attr("dy", ".35em")
            .text(d3.format(",d"));


        // Add a group for each cause.
        var cause = svg.selectAll("g.cause")
            .data(juices)
            .enter().append("svg:g")
            .attr("class", "cause")
            .style("fill", function(d, i) { return z(i); })
            .style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });

        // Add a rect for each date.
        var rect = cause.selectAll("rect")
            .data(Object)
            .enter().append("svg:rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return -y(d.y0) - y(d.y); })
            .attr("height", function(d) { return y(d.y); })
            .attr("width", x.rangeBand());


        var legendContainer = d3.select("#areachartlegend");
        legendContainer.append("ul").selectAll("ul").data(juice_types)
            .enter()
            .append("li")
            .attr("style",function(d,i) {return "color: " + z(i)})
            .text(function(d) {return d;});
    });
}

drawAreaChart();
