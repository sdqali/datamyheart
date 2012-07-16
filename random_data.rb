require 'date'

@juice_types = File.readlines("juice_types").map { |x| x.strip }
@people = (1..200).to_a << "unknown"

def random_juice
    @juice_types[rand(@juice_types.length)]
end

def random_person
    @people[rand(@people.length)]
end

dates = (Date.new(2012,01,01)..Date.new(2012,06,01)).to_a
dates.reject! { |x| x.wday == 0 or x.wday == 6 }

dates.each do |date|
   num_of_drinks = rand(30) + 210
   num_of_drinks.times do
      puts [date,random_person(),random_juice()].join(",")
   end
end   
