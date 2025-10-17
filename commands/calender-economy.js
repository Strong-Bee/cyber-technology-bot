import axios from 'axios';

const options = {
  method: 'GET',
  url: 'https://ultimate-economic-calendar.p.rapidapi.com/economic-events/tradingview',
  params: {
    from: '2024-06-17',
    to: '2024-06-19',
    countries: 'US, DE'
  },
  headers: {
    'x-rapidapi-key': 'd20530744bmshbad0c5524d9bb68p19d779jsn95beca24622b',
    'x-rapidapi-host': 'ultimate-economic-calendar.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}