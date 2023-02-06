import Home from "@/pages/index";
import {useRouter} from "next/router";
import {Col, Row, Spinner} from "react-bootstrap";
import Outer from "@layout/outer";
import Inner from "@layout/inner";

export default function ForAddress() {
  const router = useRouter();
  const stakeAddress = router?.query?.stakeAddress as string;
  if (!stakeAddress)
    return <Outer><Inner><Row><Col><Spinner animation="border" /></Col></Row></Inner></Outer>

  return Home({stakeAddress});
}