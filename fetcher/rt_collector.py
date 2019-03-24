"""
Fetches and parses Rotten Tomatoes data to return a dictionary containing:
- audience_rating (Numeric percentage of what the audience thought)
- fresh_count (Number of fresh reviews)
- rotten_count (Number of rotten reviews)
- official_score (RT)
"""

import re
import requests
from bs4 import BeautifulSoup

ROOT_URL = 'https://www.rottentomatoes.com/m/'

FRESH_COUNT = ('fresh_count', re.compile(r'Fresh\s?\(([\d]+)\)'))
ROTTEN_COUNT = ('rotten_count', re.compile(r'Rotten\s?\(([\d]+)\)'))
OFFICIAL_SCORE = ('official_score', re.compile(r'([\d]+\%)[\n\s]*TOMATOMETER'))
AUDIENCE_RATING = ('audience_rating', re.compile(r'([\d]+\%)[\n\s]*liked\sit'))

RES = [
    FRESH_COUNT,
    ROTTEN_COUNT,
    OFFICIAL_SCORE,
    AUDIENCE_RATING
]

class RTCollector:
    """
    Gets RT data through scraping
    """

    def get_scores(id):
        """
        Gets scores of given id
        """
        print("Getting RT data")
        html = get_html_page(id)
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            page = soup.get_text()
            return get_stats(page)
        return None


def get_stats(page):
    """
    Runs the REs on the page string to extract stats :)
    """
    movie_stats = {}
    for field, field_re in RES:
        match = field_re.search(page)
        if match:
            movie_stats[field] = match.group(1)
        else:
            print("No match for", field)
    return movie_stats

def get_html_page(id):
    """
    GET request a url
    """
    url = ROOT_URL + id
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    print('Returned response code', response.status_code)
    return None



# if __name__ == '__main__':
#     data = RTCollector.get_scores('captain_marvel')
#     print(data)
