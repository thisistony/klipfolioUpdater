## Why do I need this?

Klipfolio currently only updates data sources if there is an user logged in. So if someone logs in for the first time in the morning, it will take a few minutes for fresh data  to be delivered.

This script will update all Klipfolio data sources in the background regardless of the requirement.

## How does it work?  

It utilises the Klipfolio API firstly by downloading a list of all of data source IDs, and then loops through and force a refresh data sources with "Adobe Analytics" in the description.

Please feel free to modify the script if you want it to force refresh every data source.

## How do I install it?

**Download the script** - modify the ./config/ by putting in your Klipfolio API key in. For more information, please go to: https://support.klipfolio.com/hc/en-us/articles/215548478-Generate-a-Klipfolio-API-Key

**Create a new Lambda function** - Zip it all up containing your Klipfolio API ID and upload.

**Schedule it using CloudWatch** - You can specify it to run at any interval you wish. Just use a cron job.

## Where do I get more information?

Feel free to contact me on hello@thisistony.com
