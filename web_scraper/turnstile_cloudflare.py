from twocaptcha import TwoCaptcha
import undetected_chromedriver as uc
import time
import os

url = 'https://seleniumbase.io/apps/turnstile'
# Define the file path
file_path = '/home/coynes5/PycharmProjects/Gig-Scraping-and-AI-Proposals/web_scraper/api_key.txt'

with open(file_path, 'r') as file:
    api_key = file.read().strip()  # .strip() removes any leading/trailing whitespace or newline characters

solver = TwoCaptcha(api_key)
sitekey='3x00000000000000000000FF'

response = solver.recaptcha(
	sitekey=sitekey,
	url=url,
	)
