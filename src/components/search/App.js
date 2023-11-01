import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { useSelector, useDispatch } from 'react-redux';
import * as API from '../../services/Axios';
import './App.css';

function App() {
  const [PeopleData, setPeopleData] = useState([]);
  const [resultAvailable, setResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const results = useSelector(state => state.fetchAPI);
  const dispatch = useDispatch();


  useEffect(() => {
    if (results.length === 0) {
      fetch();
    } 
    if (results.length > 0) {
      fetched();
    }
    
  }, [results]);
  

  let fetch = () => {
    dispatch(API.aiportSearch());
  }
  let fetched = () => {
    setLoading(false);
    let data = [...results];
  //  const filterData = data.filter(person => person.type === 'Cat').sort((a, b) => a.name.localeCompare(b.name));
    console.log("fetchCats = >", fetchCats(data));
    setPeopleData(fetchCats(data));
    setResult(true);
  }
  
  const render = (data) => {
        if (data === undefined) {
            return <div className="nodata">no data found</div>;
        }
        let catsDom = createCats(data.maleList, 'male') + createCats(data.femaleList, 'female');
        return catsDom !== '' ? <div>{ ReactHtmlParser(catsDom) }</div> : <div className="nodata">no data found</div>;
    }

  const createCats = (list, type) => {
        if (list === undefined || !Array.isArray(list) || type === undefined || type === '') {
            return '';
        }
        const template = list.map(item => createTemplate(item)).join('');
        return '<div class="header ' + type + '">' + type + '</div>' + template;
    }

  const createTemplate = (obj) => {
        let def = '';
        if (obj && obj.name && obj.userName) {
            def = `<div class="card"><div class="container"><h4>Pet Name : ${obj.name}</h4><p> Owner : ${obj.userName}</p></div></div>`;
        }
        return def;
    }

  const parseData = (data) => {
    if (data === undefined || !Array.isArray(data) || data.length === 0) {
        return [];
    }
    let cats = data.reduce((collection, owner) => {
        if (owner.pets) {
            let pets = owner.pets.map((pet) => {
                let userMergedPet = {};
                Object.assign(userMergedPet, pet);
                userMergedPet.userName = owner.name;
                userMergedPet.userGender = owner.gender;
                return userMergedPet;
            });
            return collection.concat(pets);
        } else {
            return collection;
        }
    }, []);
    return cats;
}

const sortObject = (property, order) => {
    if (property === undefined || order === undefined || property.length === 0 || order.length === 0) {
        return;
    }
    let sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }
    return (a, b) => {
        let result;
        if (order.toLowerCase() === 'asc') {
            result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        } else {
            result = (a[property] > b[property]) ? -1 : (a[property] < b[property]) ? 1 : 0;
        }
        return result * sortOrder;
    };
}

const fetchCats = (data) => {
    if (data === undefined) {
        return {};
    }
    let catArray = parseData(data);
    if (catArray.length === 0) {
        return {};
    }
    return {
        maleList: sortCats(filterCats(catArray.filter(item => item.userGender === 'Male'))),
        femaleList: sortCats(filterCats(catArray.filter(item => item.userGender === 'Female')))
    };
}

const sortCats = (list) => {
    if (list === undefined || !Array.isArray(list) || list.length === 0) return [];
    return list.sort(sortObject('name', 'asc'));
}

const filterCats = (cats) => {
    if (cats === undefined || !Array.isArray(cats) || cats.length === 0) return [];
    return cats.filter((item) => item.type.toLowerCase() === 'cat');
}
  
  return (
    <div style={{ outline: 'none', border: 0 }}>
      {loading === false &&
        <div>
          {
            resultAvailable === true && 
            <div className="people" data-testid="peopleContainer">
              {
                render(PeopleData)
              }
          </div>
          }
          {
            resultAvailable === true && PeopleData.length === 0 &&
            <div className="nodata">no data found</div>
          }
        </div>
      }
    </div>
  );
}

export default App;
