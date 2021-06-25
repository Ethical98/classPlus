import React, { useEffect, useState, useCallback, useRef } from 'react';
import './App.css';
import axios from 'axios';
import { Container, Navbar, Form, InputGroup, Badge } from 'react-bootstrap';
import ImageCard from './components/ImageCard';
import Loader from './components/Loader';
import Message from './components/Message';
import './components/ImageGrid.css';

function App() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [images, setImages] = useState([]);
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const [message, setMessage] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  var id = 0;

  const observer = useRef();

  const lastImageRef = useCallback(
    (x) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevpageNumber) => prevpageNumber + 1);
        }
      });
      if (x) {
        observer.current.observe(x);
      }
    },
    [loading, hasMore]
  );

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
      setLoading(true);
      window.scrollTo(0, 0);
      const { data } = await axios.get(url);
      if (data.photos.photo.length === 100) {
        setImages([...data.photos.photo]);

        setHasMore(data.photos.photo.length > 0);
        setLoading(false);
      }
    } catch (error) {
      setMessage('Something went wrong...!! Please Refresh');
    }
  };

  useEffect(() => {
    const url = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=${process.env.REACT_APP_FLICKR_KEY}&page=${pageNumber}&format=json&nojsoncallback=1`;
    getImages(url);

    // eslint-disable-next-line
  }, [pageNumber]);

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
    setImages([]);
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
                  placeholder='Start Searching here...'
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
        ) : (
          loading && <Loader />
        )}
      </Container>
      <Container className='imageGrid' style={{ marginTop: '15vh' }}>
        {images.length > 0 &&
          images.map((image, index) => {
            const url = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
            id = id + 1;
            if (images.length === index + 1) {
              return (
                <div key={id} ref={lastImageRef}>
                  <ImageCard key={id} alt={image.tilte} url={url} />
                </div>
              );
            } else {
              return <ImageCard key={id} alt={image.tilte} url={url} />;
            }
          })}
      </Container>
    </>
  );
}

export default App;
