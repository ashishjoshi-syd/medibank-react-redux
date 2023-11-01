import { getPeople } from '../Redux/actions';
import axios from 'axios';

function aiportSearch() {
  return (dispatch) => {
    const url = 'https://gist.githubusercontent.com/medibank-digital/a1fc81a93200a7b9d5f8b7eae0fac6f8/raw/de10a4fcf717e6c431e88c965072c784808fd6b2/people.json';
    axios.get(url)
      .then(response => {
        dispatch(getPeople(response.data))
      })
      .catch(error => {
        throw (error);
      });
  };
}

export { aiportSearch }