import {useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import tutorial from "../assets/tutorial.mp4";
import "../styles/RawTextBox.css";


const Tutorial = ({displayHelp}) => {
    const [openVideo, setOpenVideo] = useState(false);


  return (
      <div>
          <span
              className="tutorial-prompt d-flex align-items-center gap-1"
              style={{ opacity: displayHelp ? 1 : 0 }}
              onClick={() => setOpenVideo(true)}
          >
              <FontAwesomeIcon icon={faCircleInfo} /> Watch Tutorial
          </span>
          <Modal show={openVideo} onHide={() => setOpenVideo(false)} size="xl">
              <Modal.Header closeButton>
                  <Modal.Title style={{ textTransform: "capitalize" }}>
                      How to use this page
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <video src={tutorial} className="col-12" controls></video>
              </Modal.Body>
          </Modal>
      </div>
  );
}

export default Tutorial