var juices;
var data;

d3.csv("../per_day_data.csv",function(d){
        var parse = d3.time.format("%Y-%m-%d").parse;

        data=d;
        data.forEach(function(s) {
                s.date = parse(s.date);
                s.total = +s.total;
        })


        juices = d3.nest()
                                                 .key(function(d) {return d.juice})
                                                 .sortValues(function(a,b) {return a.date<b.date?-1:(a.date==b.date)?0:1})
                                                 .entries(data);

        juices.forEach(function (juice) {
                juice.max=d3.max(juice.values,function(d) {return +d.total});
                juice.min=d3.min(juice.values,function(d) {return +d.total});
        })

        juices.max = d3.max(juices,function(d) {return d.max});

        drawHeatMap(juices,d3.select("#heatmap"),juices.max);

});

var posX;
var color;

function drawHeatMap(juices,container,max) {
        var w=1000,h=500;
        posX = d3.scale.linear().domain([0,juices[0].values.length]).range([0,w]);
        var posY = d3.scale.linear().domain([0,juices.length]).range([0,h]);

        color = d3.scale.linear().domain([0,max]).range(["peachpuff","red"]);
        var width=30,height=20;
        var juicesContainer = container.append("svg").selectAll("svg")
                                         .data(juices)
                                         .enter()
                                         .append("g")
                                         .attr("transform", function(d,i) {return "translate(100," + height*i +")"});

        juicesContainer.selectAll("#map").append("g").attr("transform","translate(100,0)")
                                         .data(function(d) {return d.values;})
                                         .enter()
                                         .append("rect")
                                         .attr("x",function(d,i) {return width*i;} )
                                         .attr("width",width)
                                         .attr("height",height)
                                         .attr("stroke","white")
                                         .attr("stroke-width","1.5")
                                         .attr("fill",function(d){return color(d.total)});

        juicesContainer.append("g").append("text").text(function(d) {return d.key});



/*
        juices.forEach(function(juice) {
                juice.values.forEach(function(date) {
                        container.append("div").attr("style",function(d) {return "position:absolute;top" + })
                })
        })*/
}
