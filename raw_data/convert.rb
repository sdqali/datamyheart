require 'rubygems'
require 'date'

@juice_types={"M" => "Musambi",
    "G" => "Grapes",
    "L" => "Lime",
    "PP" => "Papaya",
    "P" => "Pineapple",
    "A" => "Apple",
    "B" => "Banana",
    "D" => "Dates",
    "MM" => "Musk Melon",
    "MF" => "Mixed Fruit",
    "O" => "Orange",
    "W" => "Watermelon",
    "C" => "Chikku"
}

real_data = File.open("real_data.csv","w")
days = {}

real_data.puts "date,emp_id,juice"
Dir.glob("*_2012").each do |filename|
   day,month,year = filename.split("_").map { |x| x.to_i }
   date = Date.new(year,month,day)
   days[date] = {}
   @juice_types.each { |symbol,juice| days[date][symbol] = 0 }
   File.readlines(filename).each do |record|
       emp_id,juice_symbol = record.split
       days[date][juice_symbol] += 1
       real_data.puts [date,emp_id,@juice_types[juice_symbol]].join(",")
   end
end

per_day_data = File.new("per_day_data.csv","w")
per_day_data.puts("date,juice,total")
days.each do |date,juices|
    juices.each do |symbol,count|
        per_day_data.puts "#{date},#{@juice_types[symbol]},#{count}"
    end
end
