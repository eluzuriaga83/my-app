import React from 'react';
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Locations(){
    //state variables 
    const [dict, setDict] = useState([]) //for the data that I am going to work
    const [loadingDict, setLoadingDict] = useState(false)
    const [country, setCountry] = useState([]) //for the country dropdown
    const [loadingCountry, setLoadingCountry] = useState(false)
    const [selectedOption, setSelectedOption] = useState(['US'])
    
    //getting the countries information
    useEffect(() => {
      setLoadingCountry(true)
      fetch('https://docs.openaq.org/v1/countries?limit=200&page=1&offset=0&sort=asc&order_by=country')
      .then(response => response.json())
      .then(data => {
        setCountry(data.results)
        setLoadingCountry(false)
        })
    },[])

   
    
    const handleOnClick = (option) => {
      var strCountry = selectedOption;
      //getting the locations for country
      setLoadingDict(true)
      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?limit=100&page=1&offset=0&sort=desc&radius=1000&country_id='+ selectedOption +'&order_by=location&entity=community&dumpRaw=false')
      .then(response => response.json())
      .then(data => {
        const dataFetch = data.results
        console.log(dataFetch)
        setLoadingDict(false)
          const results =[]
          if(dataFetch.length > 0 && dataFetch){
            

            dataFetch.forEach(function (loc){   
                console.log(loc.name);
                let counter = 0; //I created this counter to identify what communities achieve the parameter >= 5'µg/m³'
                
                //console.log(loc.parameters);
                loc.parameters.forEach(function (task) {
                    let unit = task.unit;
                    let average = task.average;
                    
                    if (unit==='µg/m³' && average >= 5 && counter===0) {
                      counter+=1}
                    
                })
                if (option ===1){
                  if(counter>0){//If the counter is >0 it means that there is at least one parameter that is >= 5'µg/m³'
                    const dict_locations={
                      'name': loc.name,
                      'coordinates': loc.coordinates,
                    } 
                    results.push(dict_locations)
                  }
                }
                else{
                  if(counter===0){//If the counter is ===0 it means that that this communities have parameters < 5'µg/m³'
                    const dict_locations={
                      'name': loc.name,
                      'coordinates': loc.coordinates,
                    } 
                    results.push(dict_locations)
                  }
                }
              
          })}   
          setDict(results)  
          console.log(dict)
       
        })

    }


    if(loadingDict || loadingCountry){
        return 'Loading...'
      }
    
      return (
        <div className="summary">
          
          <br/>
          <br/>
          <h1>Visualize entities of community for United States</h1>
          Countries:
          <select id='country'
            value={selectedOption}
            onChange={e => setSelectedOption(e.target.value)}>

            {country.length > 0 && country.map((country, index) => 
                <option key={country.code} value={country.code}>{country.name}</option>
            )}
          </select>
          <h4>Click here to see commmunties with one parameter bigger that 5 µg/m³)</h4>
          <button onClick={() => handleOnClick(1)}>Get Locations</button>
          
          <h4>Click here if you want to see commmunties with one parameter less that 5 µg/m³)</h4>
          <button onClick={() => handleOnClick(2)}>Get Locations</button>
          <ul>
            {dict.length > 0 && dict.map((loc,index) => 
               <li key={`${index}`}>{loc.name}</li>
            )}
          </ul>
        </div>
      );

}

export default  Locations;