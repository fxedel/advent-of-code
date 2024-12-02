use std::{env, fs::read_to_string};
use regex::Regex;
use lazy_static::lazy_static; // 1.3.0

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        panic!("Usage: 01.rs <input file>")
    }

    let file_path = &args[1];

    println!("Sum of game IDs: {}", sum_valid_games(file_path));
    println!("Sum of minimum games: {}", sum_minimum_games(file_path));
}

fn sum_valid_games(file_path: &String) -> i32 {
    let mut sum_valid_games = 0;

    for line in read_to_string(file_path).unwrap().lines() {
        let (game_id, draws) = parse_game(line);
        let mut possible = true;

        for (red, green, blue) in draws {
            if red > 12 || green > 13 || blue > 14 {
                possible = false;
                break;
            }
        }

        if possible {
            sum_valid_games += game_id;
        }
    }

    return sum_valid_games;
}

fn sum_minimum_games(file_path: &String) -> i32 {
    let mut sum_minimum_games = 0;

    for line in read_to_string(file_path).unwrap().lines() {
        let (_, draws) = parse_game(line);

        let mut min_red = 0;
        let mut min_green = 0;
        let mut min_blue = 0;

        for (red, green, blue) in draws {
            if red > min_red {
                min_red = red;
            }
            if green > min_green {
                min_green = green;
            }
            if blue > min_blue {
                min_blue = blue;
            }
        }

        sum_minimum_games += min_red*min_green*min_blue;
    }

    return sum_minimum_games;
}

lazy_static! {
    static ref RE_GAME_LINE: Regex = Regex::new(r"^Game (\d+): (.+)$").unwrap();
    static ref RE_GAME_DRAWS_RED: Regex = Regex::new(r"(\d+) red").unwrap();
    static ref RE_GAME_DRAWS_GREEN: Regex = Regex::new(r"(\d+) green").unwrap();
    static ref RE_GAME_DRAWS_BLUE: Regex = Regex::new(r"(\d+) blue").unwrap();
}

fn parse_game(line: &str) -> (i32, Vec<(i32, i32, i32)>) {

    let mut draws: Vec<(i32, i32, i32)> = Vec::new();

    let re_match = RE_GAME_LINE.captures(line).unwrap();

    let game_id: i32 = re_match.get(1).unwrap().as_str().parse().unwrap();

    let draws_str = re_match.get(2).unwrap().as_str();
    for draw_str in draws_str.split("; ") {
        let re_red_match = RE_GAME_DRAWS_RED.captures(draw_str);
        let red: i32 = match re_red_match {
            Some(capture) => capture.get(1).unwrap().as_str().parse().unwrap(),
            None => 0
        };

        let re_green_match = RE_GAME_DRAWS_GREEN.captures(draw_str);
        let green: i32 = match re_green_match {
            Some(capture) => capture.get(1).unwrap().as_str().parse().unwrap(),
            None => 0
        };

        let re_blue_match = RE_GAME_DRAWS_BLUE.captures(draw_str);
        let blue: i32 = match re_blue_match {
            Some(capture) => capture.get(1).unwrap().as_str().parse().unwrap(),
            None => 0
        };

        draws.push((red, green, blue));
    }

    return (game_id, draws);
}
