import json
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

def readComments():
    f = open('scraper/comments.json', 'r')
    data = json.load(f)
    return data['comments']

def is_positive(comment: str) -> bool:
    """True if comment has positive compound sentiment, False otherwise."""
    return sia.polarity_scores(comment)["compound"] > 0

comments = readComments()
totalCommentsCount = len(comments)
positiveCommentsCount = 0

sia = SentimentIntensityAnalyzer()

for comment in comments:
    if is_positive(comment):
        positiveCommentsCount += 1

print("%d%%" % ((positiveCommentsCount / totalCommentsCount) * 100), 'positive comments')
        
