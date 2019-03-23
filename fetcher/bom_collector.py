"""
Fetches data from box office mojo
"""
import re
import json
import requests
from bs4 import BeautifulSoup

ROOT_URL = 'https://www.boxofficemojo.com/movies/'

LIFETIME_GROSS = ('lifetime_gross', re.compile(r'Worldwide:\n?(.+)$'))

LIFETIME_DOMESTIC_GROSS = ('lifetime_domestic_gross',
                           re.compile(r'Domestic:\n?(.+)\n?(.+)'))

LIFETIME_WORLD_GROSS = ('lifetime_world_gross',
                        re.compile(r'Foreign:\n?(.+)\n?(.+)'))

RELEASE_DATE = ('release_date',
                re.compile(r'Release Date:(.+)Genre'))

CHART_RANKINGS = ('chart_rankings',
                  re.compile(r'Chart\nRank\n?(.|\n)*Related Stories'))

SUMMARY_RES = [
    LIFETIME_GROSS, LIFETIME_DOMESTIC_GROSS, LIFETIME_WORLD_GROSS, RELEASE_DATE
]

DAILY_GROSS = re.compile(r'AvgGross-to-DateDay #(.|\n)*\*\sNote:')


class BOMCollector:

    def get_stats(id):
        """
        Gets stats from BOM
        """
        pages = get_html_pages(id)
        return find_stats(pages)


def get_html_pages(id):
    """
    GET request a url
    """
    pages = {'summary': {
                'url': ROOT_URL + '?id=' + id,
                'html': '',
                },
             'daily': {
                'url': ROOT_URL + '?page=daily&view=chart&id=' + id,
                'html': ''
             }
    }
    for page in pages:
        response = requests.get(pages[page]['url'])
        if response.status_code == 200:
            pages[page]['html'] = response.text
        print('Returned response code %d', response.status_code)
    return pages

def find_summary_info(movie_page):
    """
    Extracts summary info from movie_page
    """
    summary = {}
    for field, field_re in SUMMARY_RES:
        match = field_re.search(movie_page)
        if match:
            summary[field] = match.group(1).replace('\xa0', u' ')
        else:
            print(f"No match for {field}")
    return summary

def convert_daily_into_dict(daily):
    """
    Converts line seperate daily info into a dict
    """
    daily_vals = daily.split('\n')
    fields = ['day_of_week', 'date', 'rank', 'gross', 'increase', 'lw', 'theatres',
              'avg_theatre', 'total_gross', 'day_in_bo']
    zipped_info = dict(zip(fields, daily_vals))
    return zipped_info

def find_daily_info(movie_page):
    """
    Returns a list of grosses per day
    """
    match = DAILY_GROSS.search(movie_page)
    if match:
        dailies = match.group(0)
        dailies = dailies.replace('AvgGross-to-DateDay #', '').replace('* Note:', '')

        dailies = dailies.split('\n\n')
        dailies = filter(lambda x: x != '',  dailies)
        converted_dailies = map(convert_daily_into_dict, dailies)

        return list(converted_dailies)

    return None

def find_stats(movie_page):
    """
    Given a html page, find the stats that exist on it
    """
    movie_stats = {}

    soup = BeautifulSoup(movie_page['summary']['html'], 'html.parser')
    page_string = soup.get_text()

    movie_stats['summary'] = find_summary_info(page_string)

    soup = BeautifulSoup(movie_page['daily']['html'], 'html.parser')
    page_string = soup.get_text()

    # print(page_string)

    movie_stats['daily'] = find_daily_info(page_string)

    return movie_stats
