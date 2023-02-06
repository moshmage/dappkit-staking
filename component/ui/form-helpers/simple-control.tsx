import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {Col, Form} from "react-bootstrap";
import {addMinutes} from "date-fns";

export type ControlType = "date" | "string" | "number" | "range" | "checkbox";

interface SimpleControlProps<T = any> {
  onChange: Dispatch<SetStateAction<T>>, label: string, text: string, type: ControlType, value?: any
}

export default function SimpleControl<T = string|number>({onChange, label, text, type = "date", value}: SimpleControlProps<T>) {

  function _onChange<T = string|number>(dispatcher: Dispatch<SetStateAction<T>>, type: ControlType) {
    return (evt: ChangeEvent<HTMLInputElement>) => {
      let value = (type !== "string" ? evt?.target?.valueAsNumber : evt?.target?.value) as any;
      if (type === "date" && value < +new Date())
        value = +addMinutes(new Date(), 5);
      dispatcher(value)
    }
  }

  return <Col>
    <Form.Label>{label}</Form.Label>
    {!["range", "checkbox"].includes(type) ? <Form.Control onChange={_onChange(onChange, type)} type={type} /> : null}
    {type === "range" ? <Form.Range onChange={_onChange(onChange, type)} value={value} /> : null}
    {type === "checkbox" ? <Form.Check type="switch" onChange={_onChange(onChange, type)} value={value} /> : null}
    {text ? <Form.Text>{text}</Form.Text> : '' }
  </Col>
}