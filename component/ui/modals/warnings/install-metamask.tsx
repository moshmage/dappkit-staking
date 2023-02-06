import {showInstallMetamaskModal} from "@stores/show-install-metamask";
import {Button, Modal} from "react-bootstrap";

export default function InstallMetamask() {
  const show = showInstallMetamaskModal();

  if (!show)
    return null;

  return <>
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Missing Metamask</Modal.Title>
      </Modal.Header>
      <Modal.Body>Please install <a className="btn-link" href="https://metamask.io/" target="_blank">Metamask</a> and reload the page</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Modal.Footer>
    </Modal>
  </>
}