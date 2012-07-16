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
        juices.total = d3.sum(juices,function(d) {return d.total});
        drawRatioLine(juices,d3.select("#ratio_line"));
});

var widthScale;


function drawRatioLine(juices,container) {
        widthScale = d3.scale.linear().domain([0,juices.total]).range([0,1024]);
        var color = d3.scale.category20c();
        juices.sort(function(a,b) {return a.total>b.total?-1:(a==b?0:1)});

        container.append("div").selectAll("div")
                                         .data(juices)
                                         .enter()
                                         .append("div")
                                         .attr("style", function(d) {
                                                return "background-color:" + color(d.key) +
                                                                         ";float:left;height:40px;width:" + Math.round(widthScale(d.total)) + "px"
                                                                        })
                                         .text(function(d) {return d.key})
}
