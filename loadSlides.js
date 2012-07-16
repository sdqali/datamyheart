
var juices;
var data;

d3.csv("real_data.csv",function(d){
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

        //drawPieChart(juices);
        //histogram(juices);
        //lineChart(juices,d3.select("body"),juices.max);
        //sparklines();
        //smallMultiples(juices);
});

function smallMultiples(juices) {

        juices.forEach(function(juice) {

        });
}

function drawPieChart(juices) {
        var dim = {h:500,w:500,r:200};
        var color = d3.scale.category20b();

        var pieChartContainer = d3.select("#pie_chart")
                                                                                                                .append("svg")
                                                                                                                .data([juices])
                                                                                                                .attr("height",dim.h)
                                                                                                                .attr("width",dim.w)
                                                                                                                .append("svg:g")
                                                                                                                        .attr("transform","translate("+dim.r+","+dim.r+")");

        var arc = d3.svg.arc().outerRadius(dim.r);

        var pie = d3.layout.pie()
                                                                                 .value(function(d){return d.total});

  var arcs = pieChartContainer.selectAll("g.slice")
                                                                                                                        .data(pie)
                                                                                                                        .enter()
                                                                                                                                .append("svg:g")
                                                                                                                                .attr("class","slice");

  arcs.append("svg:path")
                        .attr("d",arc)
                        .attr("shape-rendering","auto")
                        .attr("stroke","white")
                        .attr("stroke-width",0.5)
                        .attr("fill",function(d,i) {return color(i)});

        arcs.append("svg:text")
                        .attr("transform", function(d) {
                                d.innerRadius = 0;
                                d.outerRadius = dim.r;
                                return "translate(" + arc.centroid(d) + ")";
                        })
                        .attr("text-anchor", "middle")
                        .text(function(d, i) { return juices[i].total; });


        var legendContainer = d3.select("#pie_legend");
        legendContainer.append("ul").selectAll("ul").data(juices).enter().append("li").attr("style",function(d,i) {return "color: " + color(i)}).text(function(d) {return d.key;});

}

function sparklines() {
        var data=[90,30,20,1,7,15,2,30,0,10,13,27,5,16,19];
        data = data.concat(data);
        var vis=d3.select("#sparkline").append("svg:svg").attr("width",60).attr("height",18).append("svg:g");

        var x = d3.scale.linear().domain([0,data.length]).rangeRound([0,60]);
        var y = d3.scale.linear().domain([0,d3.max(data)]).rangeRound([18,0]);
        var line = d3.svg.line()
                                                         .x(function(d,i) {return x(i)})
                                                         .y(function(d) {return y(d)}).interpolate("basis");

        vis.append("svg:path").attr("d",line(data)).attr("fill","none").attr("stroke","black").attr("stroke-width","1.2").attr("shape-rendering","auto");
        vis.append("svg:circle").attr("cx",x(data.length - 1)).attr("cy",y(data[data.length - 1])).attr("r",2).attr("fill","orangered");

}
var line;

function lineChart(juices,container,max) {
        var w = 1000, h = 500;
        var vis=container.append("svg:svg")
                                                .attr("width",w)
                                                .attr("height",h)
                                                .append("svg:g");

        var x = d3.scale.linear().domain([0,juices[0].values.length]).range([0,w]);
        var y = d3.scale.linear().domain([0,max]).range([h,0]);
        var line = d3.svg.line()
                                                         .x(function(d,i) {return x(i)})
                                                         .y(function(d) {return y(d.values)}).interpolate("linear");

        vis.selectAll("g")
           .data(juices)
                 .enter()
                 .append("svg:g")
                   .attr("class",function(d) {return d.key})
                         .append('svg:path')
                         .attr("d",function(d) {return line(d.values)})
                         .attr("stroke", "steelblue")
                         .attr("stroke-width", "1.0")
                         .attr("fill","none");
}

function histogram(juices) {

        var w = 1000, h = 500;
        var vis=d3.select("body")
                                                .append("svg:svg")
                                                .attr("width",w)
                                                .attr("height",h)
                                                .append("svg:g");

        var height = d3.scale.linear().domain([0,juices.maxTotal]).range([0,h-100]);
        var x = d3.scale.linear().domain([0,juices.length]).range([0,w-200]);

        vis.selectAll("g").data(juices)
                 .enter()
                 .append("rect")
                 .attr("x",function(d,i) {return x(i);})
                 .attr("y",function(d) {return h-height(d.total)})
                 .attr("height",function(d) {return height(d.total)})
                 .attr("width",40)
                 .attr("fill","steelblue")
                 .attr("stroke", "white");
}

function pieChart(juices) {
        var w = 500,                        //width
        h = 500,                            //height
        r = 250,                            //radius
        color = d3.scale.category20c();     //builtin range of colors

  var vis = d3.select("body")
      .append("svg:svg")              //create the SVG element inside the <body>
      .data([juices])                   //associate our data with the document
          .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
          .attr("height", h)
      .append("svg:g")                //make a group to hold our pie chart
          .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

  var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
    .innerRadius(r-30)
      .outerRadius(r);

  var pie = d3.layout.pie()           //this will create arc data for us given a list of values
      .value(function(d) { return d.total; });    //we must tell it out to access the value of each element in our data array

  var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
      .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
          .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
              .attr("class", "slice");    //allow us to style things in the slices (like text)

  arcs.append("svg:path")
      .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
      .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

/*  arcs.append("svg:text")                                     //add a label to each slice
      .attr("transform", function(d) {                    //set the label's origin to the center of the arc
              d.innerRadius = 0;
              d.outerRadius = r;
              return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
      })
      .attr("text-anchor", "middle")                          //center the text on it's origin
      .text(function(d, i) { return juices[i].total; });
*/
};
