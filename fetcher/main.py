import json
import csv
from bom_collector import BOMCollector

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
                'rt_link': row['rt_link']
            })
    return movies


def write_to_json(filename, data):
    with open(filename + '.json', 'w') as outfile:
        json.dump(data, outfile)

if __name__ == '__main__':

    movie_list = get_movie_list()
    for movie in movie_list:
        bom_id = movie['bom_id'].replace(' ','')
        movie['bom_data'] = BOMCollector.get_stats(bom_id)

    write_to_json('mcu_data', movie_list)