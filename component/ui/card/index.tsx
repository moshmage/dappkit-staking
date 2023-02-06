import {Form, Stack, Card as _Card} from "react-bootstrap";
import {StackDirection} from "react-bootstrap/Stack";

interface CardProps {
  direction?: StackDirection,
  title: string,
  children: React.ReactNode
  className?: string
}

export default function Card({title, direction = "vertical", className = "", children}: CardProps) {
  return <_Card className={className}>
    <_Card.Body>
      <_Card.Title>{title}</_Card.Title>
      <_Card.Text>
        <Stack gap={2} direction={direction}>
          {children}
        </Stack>
      </_Card.Text>
    </_Card.Body>
  </_Card>
}