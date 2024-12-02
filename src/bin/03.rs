use std::{env, fs::read_to_string};
use regex::{Regex, Match};
use lazy_static::lazy_static; // 1.3.0

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        panic!("Usage: 03.rs <input file>")
    }

    let file_path = &args[1];

    println!("Sum of part numbers: {}", parse_schematic(file_path));
}

fn parse_schematic(file_path: &String) -> (i32) {
    let mut sum_part_numbers = 0;

    let mut symbols_by_line: Vec<Vec<Symbol>> = Vec::new();

    let line_reader = read_to_string(file_path).unwrap();
    for line in line_reader.lines() {
        let symbols = parse_symbols(line);
        symbols_by_line.push(symbols);
    }

    for (i, line) in read_to_string(file_path).unwrap().lines().enumerate() {
        let numbers = parse_numbers(line);

        for number in numbers {
            let matches_previous = i > 0 && check_symbol(&number, symbols_by_line, i-1);
            let matches_current = check_symbol(&number, symbols_by_line, i);
            let matches_next = check_symbol(&number, symbols_by_line, i+1);

            if matches_previous || matches_current || matches_next {
                sum_part_numbers += number.val
            }
        }
    }

    return sum_part_numbers;
}


lazy_static! {
    static ref RE_SYMBOL: Regex = Regex::new(r"[^0-9.]").unwrap();
    static ref RE_NUMBER: Regex = Regex::new(r"[0-9]+").unwrap();
}

#[derive(Debug)]
struct Symbol {
    name: String,
    pos: usize,
    matching_numbers: Vec<i32>,
}

fn parse_symbols(line: &str) -> Vec<Symbol> {
    let mut symbols: Vec<Symbol> = Vec::new();

    for m in RE_SYMBOL.find_iter(line) {
        symbols.push(Symbol { name: m.as_str().to_string(), pos: m.start(), matching_numbers: Vec::new() })
    }

    return symbols;
}

#[derive(Debug)]
struct Number {
    val: i32,
    pos_start: usize,
    pos_end: usize,
}

fn parse_numbers(line: &str) -> Vec<Number> {
    let mut numbers: Vec<Number> = Vec::new();

    for m in RE_NUMBER.find_iter(line) {
        let val: i32 = m.as_str().parse().unwrap();
        numbers.push(Number { val: val, pos_start: m.start(), pos_end: m.end() });
    }

    return numbers;
}

fn check_symbol(number: &Number,  symbols_by_line: Vec<Vec<&mut Symbol>>, i: usize) -> bool {
    if i >= symbols_by_line.len() {
        return false;
    }

    // let symbols = symbols_by_line[i];
    let symbols = symbols_by_line.get(i).unwrap();
    // let mut new_symbols: Vec<Symbol> = Vec::new();

    let mut matches = false;

    for symbol in  symbols {

        if number.pos_start <= symbol.pos && symbol.pos <= number.pos_end {
            matches = true;
            symbol.matching_numbers.push(number.val);
        } else if number.pos_start > 0 && number.pos_start - 1 == symbol.pos {
            // special case; needs to be handled separately to avoid uint underflow
            matches = true;
            symbol.matching_numbers.push(number.val);
        }
        
        // new_symbols.push(symbol);
    }

    // symbols_by_line[i] = new_symbols;

    return matches;
}
