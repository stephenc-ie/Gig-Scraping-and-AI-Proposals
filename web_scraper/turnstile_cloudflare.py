from twocaptcha import TwoCaptcha
import sys
import undetected_chromedriver as uc
import time
import os

url = 'https://2captcha.com/demo/cloudflare-turnstile'  # also solved for https://2captcha.com/
# Define the file path
file_path = '/home/coynes5/PycharmProjects/Gig-Scraping-and-AI-Proposals/web_scraper/api_key.txt'

with open(file_path, 'r') as file:
    api_key = file.read().strip()  # .strip() removes any leading/trailing whitespace or newline characters

solver = TwoCaptcha(api_key)
sitekey = '0x4AAAAAAAC3DHQFLr1GavRN'

try:
	response = solver.turnstile(
		sitekey=sitekey,
		url=url,
		)
	print("hi?")
except Exception as e:
    sys.exit(e)
else:
    sys.exit('solved: ' + str(response))
