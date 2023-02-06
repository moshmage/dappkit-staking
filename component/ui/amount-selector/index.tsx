import {Button, Col, Form, Row, Stack} from "react-bootstrap";
import {ChangeEvent, useState} from "react";
import BigNumber from "bignumber.js";

interface AmountSelectorProps {
  onChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  tokenName: string;
  maxAmount: number;
  disabled?: boolean;
  balance: number
}

export default function AmountSelector({onChange, onBlur = (() => {}), tokenName, maxAmount, balance, disabled}: AmountSelectorProps) {
  const [value, setValue] = useState<string>('0');

  function _setValue(evt: any) {
    onChange(evt);
    setValue(evt?.target?.value)
  }

  function _onChange(percent: number) {
    const _value = BigNumber(maxAmount).multipliedBy(percent).toFixed(18, 3)
    onChange({target: {value:_value}} as any);
    onBlur();
    setValue(_value)
  }

  return <Col>
    <Row>
      <Col>
        <Stack direction="horizontal">
          <Form.Label className="me-3">{tokenName}</Form.Label>
          <Form.Control disabled={disabled} onBlur={onBlur} onChange={_setValue} value={value} type={"number"} />
        </Stack>
        <div className="w-100 text-end">
          <Form.Text className="d-flex justify-content-between">
            <div>Balance {balance}</div>
            <div>Max amount {maxAmount}</div>
          </Form.Text>
        </div>
      </Col>
    </Row>
    <Row className="my-3">
      <Col xs={12} sm={3} md={4}>
        <Button disabled={!maxAmount || disabled} onClick={() => _onChange(.1)} className="w-100">10%</Button>
      </Col>
      <Col xs={12} sm={3} md={4}>
        <Button disabled={!maxAmount || disabled} onClick={() => _onChange(.5)} className="w-100">50%</Button>
      </Col>
      <Col xs={12} sm={3} md={4}>
        <Button disabled={!maxAmount || disabled} onClick={() => _onChange(1)} className="w-100">100%</Button>
      </Col>
    </Row>
  </Col>
}