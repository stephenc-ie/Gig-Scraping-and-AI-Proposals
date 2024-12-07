## Project Overview

This repository is for an automated job tracking and proposal generation system, designed to streamline the process of finding and applying to gigs/jobs. The system is built on a Python script that operates on a Ubuntu server, leveraging a cron scheduler for periodic execution.

## How It Works

- **Data Fetching:** The Python script is configured to periodically fetch data from a Google Sheet, which is populated with personalized search terms. It scans these terms to identify and retrieve relevant gig/job listings, updating the results back to the Google Sheet.

- **Notification System:** Utilizing Google Apps Script, the system is set up to send an hourly email digest that summarizes the jobs posted within the last day, ensuring timely updates on potential opportunities.

- **Interactive Proposal Generation:** Featured in the GIF, the project includes an innovative function where clicking a hyperlink in the job listing title triggers an HTTP request. This request calls a Google Cloud Function, which processes the data and interacts with Gemini AI. It sends a custom prompt to the AI, which then promptly returns a tailored template proposal, ready for quick customization and submission.

## Key Features

- **Automated Job Tracking:** Streamlines the process of finding relevant job listings by automating the search and data aggregation process.
- **Hourly Updates:** Keeps you informed with regular updates, directly delivered to your inbox.
- **AI-Enhanced Proposals:** Generates proposal templates through AI, facilitating rapid response to job opportunities..

![AI Proposal](https://github.com/stephenc-ie/Gig-Scraping-and-AI-Proposals/blob/main/ai_proposal.gif?raw=true)
