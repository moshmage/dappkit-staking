import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {Col, Form} from "react-bootstrap";
import {addMinutes} from "date-fns";

export type ControlType = "date" | "datetime-local" | "string" | "number" | "range" | "checkbox" | "readonly";

interface SimpleControlProps<T = any> {
  onChange: Dispatch<SetStateAction<T>>, label: string, text: string, type: ControlType, value?: any;
  readonly?: boolean;
}

export default function SimpleControl<T = string|number>({onChange = (() => {}), label, text, type = "datetime-local", value, readonly}: SimpleControlProps<T>) {

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
    {!["range", "checkbox"].includes(type) ? <Form.Control readOnly={readonly} onChange={_onChange(onChange, type)} type={type} value={value} /> : null}
    {type === "range" ? <Form.Range readOnly={readonly} onChange={_onChange(onChange, type)} value={value} /> : null}
    {type === "checkbox" ? <Form.Check readOnly={readonly} type="switch" onChange={_onChange(onChange, type)} value={value} /> : null}
    {text ? <Form.Text>{text}</Form.Text> : '' }
  </Col>
}