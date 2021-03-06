import os
from datetime import datetime, timedelta

import preprocessor as p
import tweepy
from flask import Flask, jsonify, request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

consumer_key = '???'
consumer_secret = '???'
access_token = '???'
access_token_secret = '???'
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)
p.set_options(p.OPT.URL, p.OPT.MENTION, p.OPT.HASHTAG)

analyzer = SentimentIntensityAnalyzer()

app = Flask(__name__, static_folder='./build', static_url_path='/')


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route("/api/text", methods=['POST'])
def analyzeText():
    return jsonify(get_text(request.json))


@app.route("/api/twitter", methods=['POST'])
def analyzeTwitter():
    return jsonify(get_twitter(request.json))


def get_text(sentence):
    analysis = analyzer.polarity_scores(sentence)

    if analysis['compound'] >= 0.05:
        compound = 'Positive'
    elif analysis['compound'] <= - 0.05:
        compound = 'Negative'
    else:
        compound = 'Neutral'

    return [analysis['pos'], analysis['neu'], analysis['neg'], compound]


def get_twitter(query):
    data = []
    for days in range(7, -2, -1):
        results = api.search(q=query, lang='en', count=100, tweet_mode='extended',
                             until=datetime.strftime(datetime.now() - timedelta(days), '%Y-%m-%d'))
        if len(results) == 0:
            return 0
        sentiments = [0, 0, 0]
        size = 0
        for tweet in results:
            size += 1
            if hasattr(tweet, "retweeted_status"):
                tweet.full_text = tweet.retweeted_status.full_text
            text = p.clean(tweet.full_text)
            sentiment = get_text(text)[3]
            if sentiment == 'Positive':
                sentiments[0] += 1
            elif sentiment == 'Negative':
                sentiments[2] += 1
            else:
                sentiments[1] += 1

        data += [datetime.strftime(datetime.now() - timedelta(days + 1), '%B %d'),
                 sentiments[0] / size, sentiments[1] / size, sentiments[2] / size]
    return data


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
