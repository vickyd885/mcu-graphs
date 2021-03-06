"""
Script calls different collectors which in turn collect respective data.
This module is responsible for reading/writing appropiate files, namely:
- movie_links.csv -> contains metadata such as movie name, links the webpage etc
- mcu_data.json -> final output file
"""

import json
import csv

from bom_collector import BOMCollector
from rt_collector import RTCollector
from cs_collector import CSCollector

def get_movie_list():
    """
    List of MCU movies to query
    """
    movies = []
    with open('movie_links.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            movies.append({
                'movie': row['name'],
                'bom_id': row['bom_id'],
                'rt_id': row['rt_id']
            })
    return movies


def write_to_json(filename, data):
    """
    JSON dump data to a json file given a filename
    """
    with open(filename + '.json', 'w') as outfile:
        json.dump(data, outfile)

if __name__ == '__main__':

    movie_list = get_movie_list()

    for movie in movie_list:
        print("Fetching data for movie: ", movie['movie'])
        bom_id = movie['bom_id'].replace(' ','')
        rt_id = movie['rt_id'].replace(' ','')
        movie['bom_data'] = BOMCollector.get_stats(bom_id)
        movie['rt_data'] = RTCollector.get_scores(rt_id)
        movie['cinema_score'] = CSCollector.get_score(movie['movie'])

    write_to_json('mcu_data', movie_list)
