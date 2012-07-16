new_ids = {}
File.readlines("emp_ids").each_with_index do |emp_id,index|
    new_ids[emp_id.strip] = index
end

new_ids.each do |emp_id, new_id| 
    puts "#{emp_id} #{new_id}"
end

Dir.glob("*_2012").each do |file|
    out_file = File.new("obfuscated/#{file}","w")
    File.readlines(file).each do |line|
        line.strip!
        emp_id,juice = line.split
        out_file.puts "#{new_ids[emp_id]} #{juice}"
    end
end
