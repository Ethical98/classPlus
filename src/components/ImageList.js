import React, { useState, useEffect } from 'react';
import ImageCard from './ImageCard';
import './ImageGrid.css';

const ImageList = (props) => {
  const [images, setImages] = useState([]);

  const createUrl = () => {
    if (props.images) {
      const pics = props.images.map((image) => {
        const url = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;

        return <ImageCard key={image.id} alt={image.tilte} url={url} />;
      });
      if (pics) {
        setImages([...pics]);
      }
    }
  };

  useEffect(() => {
    if (props.images) {
      createUrl();
    }
    // eslint-disable-next-line
  }, [props]);

  return <div className='imageGrid'>{images}</div>;
};

export default ImageList;
