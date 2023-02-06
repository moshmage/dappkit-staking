import {Container} from "react-bootstrap";

export default function Inner({children}: {children: React.ReactNode}) {
  return <Container>
    {children}
  </Container>
}