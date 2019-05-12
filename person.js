const fetch = require('node-fetch');

const getPersonInfo = async person => {
   try {
      const response = await fetch(`https://swapi.co/api/people/?search=${person}`);
      console.log('Response From Fetch', response);
      console.log('-------------');
      console.log('-------------');
      const data = await response.json();
      console.log('JSON Data From Response', data);
      console.log('-------------');
      console.log('-------------');
      const { name, height, mass, birth_year, gender } = data.results[0];
      const personInfo = {
         name,
         height,
         mass,
         birth_year,
         gender
      };
      return personInfo;
   } catch (error) {
      console.log(`SWAPI Fetch Error: ${error.message}`)
   }
}

module.exports = getPersonInfo;
