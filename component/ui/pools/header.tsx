import {Col, Row} from "react-bootstrap";
import SimpleControl from "@component/ui/form-helpers/simple-control";
import {useState} from "react";

interface PoolsProps {
  tokenName: string;
  heldTokens: number;
  onFilter(value: boolean): void;
}

export default function PoolHeader({onFilter, tokenName, heldTokens}: PoolsProps) {
  const [hideFinished, setHideFinished] = useState<boolean>(true);

  function _onFilter() {
    onFilter(!hideFinished)
    setHideFinished(!hideFinished);
  }

  return <>
    <Row className="d-flex justify-content-between mb-2">
      <Col>
        <h3 className="mb-0">Pools</h3>
        <span>{tokenName} Pools</span>
      </Col>
      <Col className="text-end">
        <span>Contract held tokens</span>
        <h3 className="mb-0">{heldTokens}</h3>
      </Col>
    </Row>
    <Row style={{marginTop: '-1.5rem'}} className="mb-4">
      <SimpleControl onChange={_onFilter} label={''} text={'Show finished products'} type="checkbox" value={hideFinished} />
    </Row>
  </>
}