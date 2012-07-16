var juices;
var data;

d3.csv("../per_day_data",function(d){
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
	var musambi = juices.filter(function(d){return d.key=="Musambi";})
	var watermelon = juices.filter(function(d){return d.key=="Watermelon";})					
	var dates = juices.filter(function(d){return d.key=="Dates";})

	sparklines(musambi[0].values,"#Musambi",juices.max);
	sparklines(watermelon[0].values,"#Watermelon",juices.max);	
	sparklines(dates[0].values,"#Dates",juices.max);	
	
	d3.selectAll("#MusambiMax").text(musambi[0].max);				
	d3.selectAll("#WatermelonMax").text(watermelon[0].max);				
	d3.selectAll("#DatesMax").text(dates[0].max);				

	
});

function sparklines(data,juice_id,max) {
	var margin={top:3,bottom:3,left:3,right:3}
	var width=70-margin.left-margin.right;
	var height=30-margin.top-margin.bottom;
	
	var vis=d3.select(juice_id)
										.append("svg:svg")
										.attr("width",width)
										.attr("height",height)
										.append("svg:g")
										.attr("transform","translate("+margin.left+","+margin.top+")");

	var x = d3.scale.linear().domain([0,data.length]).rangeRound([0,60]);
	var y = d3.scale.linear().domain([0,max]).rangeRound([18,0]);					
	var line = d3.svg.line()
							 .x(function(d,i) {return x(i)})
							 .y(function(d) {return y(d.total)}).interpolate("basis");
							
	vis.append("svg:path").attr("d",line(data)).attr("fill","none").attr("stroke","black").attr("stroke-width","1.5").attr("shape-rendering","auto");
	vis.append("svg:circle").attr("cx",x(data.length - 1)).attr("cy",y(data[data.length - 1].total)).attr("r",2).attr("fill","orangered");
	
}