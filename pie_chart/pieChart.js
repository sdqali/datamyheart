function drawPieChartIn(container,innerRadius) {

d3.csv("../real_data.csv",function(d){
        var parse = d3.time.format("%Y-%m-%d").parse;

        data=d;
        data.forEach(function(s) {
                s.date = parse(s.date);
        })
        juices=d3.nest()
                         .key(function(d) {return d.juice;})
                         .key(function(d) {return d.date;})
                         .rollup(function(d) {return d.length;})
                         .entries(data);
        juices.forEach(function(juice) {
                juice.min=d3.min(juice.values,function(d) {return d.values});
                juice.max=d3.max(juice.values,function(d) {return d.values});
                juice.total=d3.sum(juice.values,function(d) {return d.values});
        })
        juices.min = d3.min(juices,function(d) {return d.min});
        juices.max = d3.max(juices,function(d) {return d.max});
        juices.maxTotal = d3.max(juices,function(d) {return d.total;});
        juices.total = d3.sum(juices,function(d){return d.total});
        drawPieChart(juices,container,innerRadius);
});
}


function drawPieChart(juices,container,innerRadius) {
        var dim = {h:800,w:800,r:300};
        var color = d3.scale.category20();

        var pieChartContainer = d3.select(container).select(container+"_chart")
                                         .append("svg")
                                         .data([juices])
                                         .attr("height",dim.h)
                                                                                                                                                                 .attr("width",dim.w)
                                                                                                                                                                 .append("svg:g")
                                                                                                                                                                 .attr("transform","translate("+dim.r+","+dim.r+")");

        var arc = d3.svg.arc().outerRadius(dim.r).innerRadius(innerRadius);

        var pie = d3.layout.pie()
                                                                                .value(function(d){return d.total});

                 var arcs = pieChartContainer.selectAll("g.slice")
                                                                                                                                         .data(pie)
                                                                                                                                         .enter()
                                                                                                                                         .append("svg:g")
                                                                                                                                         .attr("class","slice");

                 arcs.append("svg:path")
                        .attr("d",arc)
                        .attr("shape-rendering","geometricPrecision")
                        .attr("stroke","white")
                        .attr("stroke-width",0.5)
                        .attr("fill",function(d,i) {return color(i)});

        arcs.append("svg:text")
                        .attr("transform", function(d) {
                                d.innerRadius = dim.r-50;
                                d.outerRadius = dim.r;
                                return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("text-anchor", "middle")
                        .text(function(d, i) { return Math.round(100.0*(juices[i].total/juices.total)) + "%"; });


        var legendContainer = d3.select(container + "_legend");
        legendContainer.append("ul").selectAll("ul").data(juices)
                        .enter()
                        .append("li")
                        .attr("style",function(d,i) {return "color: " + color(i)})
                        .text(function(d) {return d.key;});

}
