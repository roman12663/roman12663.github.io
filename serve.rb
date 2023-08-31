#!/usr/bin/env ruby

require "optparse"

module ServeScript
  SERVE = { alias: "bundle exec jekyll serve",
            flags: ["--host", "--port"],
            default: { PORT: 8080 } }

  def self.serve(host = nil, port = SERVE[:default][:PORT])
    if host.nil?
      exec("#{SERVE[:alias]} #{SERVE[:flags][1]}=#{port}")
    else
      exec("#{SERVE[:alias]} #{SERVE[:flags][0]}=#{host} --port=#{port}")
    end
  end

  def self.parse_options
    options = { port: SERVE[:default][:PORT] }
    OptionParser.new do |opts|
      opts.on("-f [HOST]", "--from [HOST]", "Specify the host") do |host|
        options[:host] = host || "0.0.0.0"
      end

      opts.on("-p [PORT]", "--port [PORT]", "Specify the port") do |port|
        if port.to_s.empty?
          options[:port] = 80
        else
          options[:port] = port.to_i
        end
      end
    end.parse!

    options
  end

  def self.run
    options = parse_options

    print "\e[H\e[2J" # ANSI escape to clear terminal

    OptionParser.new do |opts|
      opts.on("-h", "--help", "Prints help") do
        puts opts
        exit
      end
    end.parse!

    serve(options[:host], options[:port])
  end
end

ServeScript.run
