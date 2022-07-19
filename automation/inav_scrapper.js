// Puppeteer
const {selectorForINAVTable} = require("../setup") // importing table > tr selector from setup file
const puppeteer = require("puppeteer"); // initializing puppeteer

exports.inavScrapper = async (sectors, urls) => {
	const browser = await puppeteer.launch({ headless: true }) // here headless:true => without browser
	let counter = 0;
	const scrappedData = {};

	for (url of urls) // looping through urls
	{
		const page = await browser.newPage();
		await page.goto(url,  {waitUntil: 'networkidle0', timeout: 60000}); // opening webpage (here timeout is in miliseconds)
		await page.waitForSelector(selectorForINAVTable).catch(error => { 
			console.log("Error occurred while searching for the element: "+error.message);
			browser.close();
			return false;
		}); // waiting for selector to load

		try
		{
			const tableData = await page.$$eval(selectorForINAVTable, (elem)=> {
				// here I have selected table rows using this selector
				const data = [];
				// getting td text of each row
				const date  = elem.map(el => el.querySelector('td.col-rowDate span').innerHTML);
				const price = elem.map(el => el.querySelector('td.col-last_close span').innerHTML);
				const open = elem.map(el => el.querySelector('td.col-last_open span').innerHTML);
				const high = elem.map(el => el.querySelector('td.col-last_max span').innerHTML);
				const low = elem.map(el => el.querySelector('td.col-last_min span').innerHTML);
				const volume = elem.map(el => el.querySelector('td.col-volume span').innerHTML);
				const chg = elem.map(el => el.querySelector('td.col-change_percent span').innerHTML);
				const datalength = date.length; // datalength => rows count of table
	
				for(var i=0; i<datalength; i++)
				{
					// creating object. i.e. passing scrapped data of table in row wise order
					data.push({
						date: date[i],
						price: price[i],
						open: open[i],
						high: high[i],
						low: low[i],
						volume: volume[i],
						chg: chg[i],
					});
				}
				return data;
			});

			scrappedData[sectors[counter]] = tableData; // storing scrapped table data
			console.log("Got data from (",counter,"): ",url);
			counter += 1;
		}
		catch(error)
		{
			console.log("Error occurred while getting the data from the webpage: "+error.message);
			await browser.close();
			return false;
		}
	}
	await browser.close(); // wait for the browser to close
	return scrappedData;
}