import {Modal} from "react-bootstrap";


export default function NotAdminModal({show = false}) {
  return <Modal show={show}>
    <Modal.Header>
      <Modal.Title>Wrong account</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Configured public governor address does not match the one you provided;</p>
      <p>Switch accounts to the configured account and this warning will disappear.</p>
      <span className="d-none">You won't gain access by deleting this modal.</span>
    </Modal.Body>
  </Modal>
}