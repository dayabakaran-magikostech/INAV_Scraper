const {inavScrapper} = require("./automation/inav_scrapper"); // Initializing scrapper function
const express = require('express');
const app = express();
app.use(express.json()); // so our app can handle json data

require("dotenv").config(); // including .env file
const port = process.env.port;


app.post('/fetch-inav-data', async function (req, res)
{
	console.log("Got a POST request to fetch inav data");
	if(req.body.urls)
	{
		const sectors = Object.keys(req.body.urls); // getting keys from body > urls
		const urls = Object.values(req.body.urls); // getting urls from body > urls
		if(sectors.length >=1 && urls.length >= 1) // checking if user has passed atleast 1 url
		{
			const result = await inavScrapper(sectors, urls); // invoking scrapper function by passing values and urls as arguments
			if(result)
			{
				res.status(200).send({msg:"Response Data" , result}); // sending response data from scrapper function
				console.log("Response sent to page");
			}
			else
			{
				res.status(500).send({msg:"Internal Server Error"});
				console.log("Error occurred in inav scrapper");
			}
		}
		else
		{
			res.status(400).send({msg:"Please pass an valid array"});
			console.log("Please pass an valid array");
		}
	}
	else
	{
		res.status(400).send({msg:"Please pass an array"});
		console.log("Please pass an array");
	}
});

app.listen(port, () => {
	console.log(`Scraper app listening on port ${port}`);
});