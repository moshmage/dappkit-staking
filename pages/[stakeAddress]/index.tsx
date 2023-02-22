import Home from "@/pages/index";
import {useRouter} from "next/router";

export default function ForAddress() {
  const router = useRouter();
  const stakeAddress = router?.query?.stakeAddress as string;

  return Home({stakeAddress, waitForRoute: true});
}