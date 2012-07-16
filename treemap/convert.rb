require 'rubygems'

records=File.readlines("../real_data")[1..-1].map { |x| x.strip.split(",") }
juices = {}
records.each do |record|
   date,emp_id,juice=record
   juices[juice] ||= {}
   juices[juice][emp_id] ||= 0
   juices[juice][emp_id] += 1
end

puts "{ \"name\": \"juices\", \"children\": ["
juices.each do |juice,employees|
    puts "{\"name\": \"#{juice}\","
    puts "\"children\": ["
    puts employees.map { |emp, total|
         "{\"name\": \"#{emp}\", \"size\": #{total}}"
    }.join(",\n")
    puts "]}," 
end
puts "]}"
