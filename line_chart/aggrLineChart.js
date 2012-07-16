function drawTotalLineChart() {
var juices;
var data;

d3.csv("../totals",function(d){
	var parse = d3.time.format("%d-%m-%Y").parse;

	data=d;
	data.forEach(function(s) {
		s.date = parse(s.date);
		s.total = +s.total;
	})
	
	juices=data;
	juices.sort(function(a,b){return a.date<b.date?-1:a.date==b.date?0:1});
	juices.max = d3.max(juices,function(d) {return d.total});
						
	drawAggrLineChart(juices,d3.select("#aggr_line_chart"),juices.max);					
	
});

function drawAggrLineChart(juices, container,max) {
	var margin = {left:30,right:30,top:10,bottom:30}
	var w = 1000 - (margin.left + margin.right), h = 500-(margin.top + margin.bottom);
	//var w = 1000, h = 500;

	
	var color=d3.scale.category20();
	var vis=container.append("svg:svg")
						.attr("width",w+margin.left+margin.right)
						.attr("height",h+margin.top+margin.bottom)
						.append("svg:g")
						.attr("transform","translate("+margin.left+","+margin.top+")");

	var x = d3.scale.linear().domain([0,juices.length-1]).range([0,w]);
	var y = d3.scale.linear().domain([0,max]).range([h,0]);					
	var line = d3.svg.line()
							 .x(function(d,i) {return x(i)})
							 .y(function(d) {return y(d.total)}).interpolate("linear");

	var dateFormatter = d3.time.format("%d/%m");						
	var yAxis = d3.svg.axis().orient("left");						
	var xAxis = d3.svg.axis().orient("bottom").ticks(20).tickFormat(function(d) { return dateFormatter(juices[d].date)});						


	vis.append("svg:g")
			 .append('svg:path')
			 .attr("d",function(d) {return line(juices)})
			 .attr("stroke", "steelblue")
			 .attr("stroke-width", "2.0")
			 .attr("fill","none");	
			
	vis.append("g").attr("class","axis").call(yAxis.scale(y));
	vis.append("g").attr("transform","translate(0,"+h+")").attr("class","axis").call(xAxis.scale(x));
	
}
}

drawTotalLineChart();