use std::{env, fs::read_to_string};

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        panic!("Usage: 01.rs <input file> [--part-two]")
    }
    
    let file_path = &args[1];

    let part_two = args.len() >= 4 && &args[2] == "--part-two";

    println!("Sum of calibration values: {}", sum_calibration_values(file_path, part_two));
}


fn sum_calibration_values(file_path: &String, parse_words: bool) -> i32 {
    let mut sum_calibration_values = 0;

    for line in read_to_string(file_path).unwrap().lines() {
        let mut first_digit: i32 = 0;
        let mut last_digit: i32 = 0;

        let mut found_digit = false;
        
        for i in 0..line.len() {
            match get_digit_at(line, i, parse_words) {
                Some(digit) => {
                    if !found_digit {
                        first_digit = digit;
                    }
                    last_digit = digit;
                    found_digit = true;
                }
                None => ()
            }
        }

        
        if !found_digit {
            panic!("did not find any digit in line '{}'", line);
        }

        let calibration_value = first_digit * 10 + last_digit;
        sum_calibration_values += calibration_value;        
    }

    return sum_calibration_values;
}

fn get_digit_at(s: &str, i: usize, parse_words: bool) -> Option<i32> {
    let c = s.chars().nth(i).unwrap();

    if '0' <= c && c <= '9' {
        return Some(c.to_string().parse().unwrap());
    }

    if !parse_words {
        return None;
    }

    let rest_len = s.len() - i;

    if rest_len < 3 {
        return None;
    }
    match &s[i..i+3] {
        "one" => return Some(1),
        "two" => return Some(2),
        "six" => return Some(6),
        _ => ()
    }

    if rest_len < 4 {
        return None;
    }
    match &s[i..i+4] {
        "four" => return Some(4),
        "five" => return Some(5),
        "nine" => return Some(9),
        _ => ()
    }

    if rest_len < 5 {
        return None;
    }
    match &s[i..i+5] {
        "three" => return Some(3),
        "seven" => return Some(7),
        "eight" => return Some(8),
        _ => ()
    }

    return None;
}
