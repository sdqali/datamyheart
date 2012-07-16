require 'date'
require 'csv'

data = []
CSV.foreach("../real_data", "r") do |row|
  data << row
end

headers = data.first
rows = data[1..-1]

juices = []
rows.each do |r|
  juices << Hash[headers.zip(r)]
end

days = Date::DAYNAMES.map {|d| d[0..2]}

juices.each do |r|
  r["day"] = Date::DAYNAMES[Date.parse(r["date"], "%Y-%m-%d").wday][0..2]
end

juice_types = juices.map do |j|
  j["juice"]
end.uniq

aggregates = {}

days.each do |d|
  aggregates[d] = {}
  juice_types.each do |jt|
    aggregates[d][jt] = 0
  end
end


juices.each do |j|
  aggregates[j["day"]][j["juice"]] += 1
end

foo = aggregates.to_a.map do |a|
  out = a.first
  js = a[1].to_a.map do |j|
    j[1].to_s
  end
  out + "," + js.join(",")
end

headers = ["day", juice_types].flatten.join(",")
IO.write("stackchart.csv", headers + "\n" + foo.join("\n"))
