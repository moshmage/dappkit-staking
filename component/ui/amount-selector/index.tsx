import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import {ChangeEvent} from "react";
import BigNumber from "bignumber.js";

interface AmountSelectorProps {
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  tokenName: string;
  maxAmount: number;
  disabled?: boolean;
  balance: number
  amountValue: string;
}

export default function AmountSelector({onChange, onBlur = (() => {}), amountValue, tokenName, maxAmount, balance, disabled}: AmountSelectorProps) {

  function _onChange(percent: number) {
    const _value = +(BigNumber(maxAmount).multipliedBy(percent).toFixed(0, 8))
    onChange({target: {value:_value}} as any);
    onBlur();
  }

  return <Col>
    <Row>
      <Col>
        <Stack direction="horizontal">
          <Form.Label className="me-3">{tokenName}</Form.Label>
          <Form.Control disabled={disabled} onBlur={onBlur} onChange={onChange} value={amountValue} type={"number"} />
        </Stack>
        <div className="w-100 text-end">
          <Form.Text className="d-flex justify-content-between">
            <div>Balance {balance}</div>
            <div>Max amount {maxAmount}</div>
          </Form.Text>
        </div>
      </Col>
    </Row>
    <Row className="my-3 gy-3 gy-sm-0">
      <Col xs={12} sm={4} md={4}>
        <Button disabled={!maxAmount || disabled} onClick={() => _onChange(.1)} className="w-100">10%</Button>
      </Col>
      <Col xs={12} sm={4} md={4}>
        <Button disabled={!maxAmount || disabled} onClick={() => _onChange(.5)} className="w-100">50%</Button>
      </Col>
      <Col xs={12} sm={4} md={4}>
        <Button disabled={!maxAmount || disabled} onClick={() => _onChange(1)} className="w-100">100%</Button>
      </Col>
    </Row>
  </Col>
}