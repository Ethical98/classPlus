import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Container, Navbar, Form, InputGroup, Badge } from 'react-bootstrap';
import ImageList from './components/ImageList';
import Loader from './components/Loader';
import Message from './components/Message';

function App() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [images, setImages] = useState('');
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(term);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [term]);

  const getImages = async (url) => {
    try {
      const { data } = await axios.get(url);
      if (data) {
        setImages([...data.photos.photo]);
      }
    } catch (error) {
      setMessage('Something went wrong...!! Please Refresh');
    }
  };

  useEffect(() => {
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${process.env.REACT_APP_FLICKR_KEY}&format=json&nojsoncallback=1`;
    getImages(url);
  }, []);

  const searchSuggestions = async (x) => {
    setTerm(x);
  };

  const suggestions = localStorage.getItem('H')
    ? JSON.parse(localStorage.getItem('H')).map((x) => {
        return (
          <Badge
            className='mx-1'
            variant='info'
            onClick={() => searchSuggestions(x)}
            key={x}
          >
            {x}
          </Badge>
        );
      })
    : [];

  const getSearchResults = async () => {
    setSearchHistory([...searchHistory, term]);
    const searchItems = [...new Set(searchHistory)];
    localStorage.setItem('H', JSON.stringify(searchItems));
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLICKR_KEY}&tags=${term}&format=json&nojsoncallback=1`;
    getImages(url);
  };

  useEffect(() => {
    if (debouncedTerm) {
      getSearchResults();
    }
    // eslint-disable-next-line
  }, [debouncedTerm]);

  return (
    <>
      <div>
        <Navbar bg='dark' variant='dark' fixed='top'>
          <Container>
            <Navbar.Brand href='/'>Search Photos</Navbar.Brand>
            <Form style={{ width: '40vw' }} className='mx-auto'>
              <InputGroup>
                <Form.Control
                  value={term}
                  required
                  type='text'
                  placeholder='Search'
                  onChange={(e) => setTerm(e.target.value)}
                />
              </InputGroup>
            </Form>
          </Container>
        </Navbar>
        {suggestions.length > 0 && (
          <Navbar bg='dark' variant='dark' fixed='bottom'>
            <Navbar.Text>Suggesstions: </Navbar.Text>
            <Navbar.Text>{suggestions}</Navbar.Text>
          </Navbar>
        )}
      </div>
      <Container style={{ marginTop: '15vh' }}>
        {message ? (
          <Message variant='danger'>{message}</Message>
        ) : images ? (
          <ImageList images={images}></ImageList>
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
}

export default App;
