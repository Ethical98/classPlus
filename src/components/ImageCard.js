import React, { useState, useRef, useEffect } from 'react';
import { Modal, Image, Button, Container } from 'react-bootstrap';

const ImageCard = (props) => {
  const [spans, setSpans] = useState(0);
  const [show, setShow] = useState(false);

  const imageRef = useRef('');

  useEffect(() => {
    imageRef.current.addEventListener('load', setSpan);
  }, [imageRef, props]);

  const setSpan = () => {
    const height = imageRef.current.clientHeight;

    const span = Math.ceil(height / 10);

    setSpans(span);
  };

  return (
    <>
      <div style={{ gridRowEnd: `span ${spans}` }}>
        <Image
          onClick={() => setShow(true)}
          ref={imageRef}
          alt={props.alt}
          src={props.url}
        />
      </div>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container style={{ height: '50%', width: '50%' }}>
            <Image fluid ref={imageRef} alt={props.alt} src={props.url} />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImageCard;
