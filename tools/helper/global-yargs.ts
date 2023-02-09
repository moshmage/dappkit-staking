import {Argv} from "yargs";

export const DEFAULT_OPTIONS = (argv: any): Argv<{web3Host: string; privateKey: string}> => argv
  // .middleware((argv: ArgumentsCamelCase<{web3Host: string; privateKey: string}>) => {
  //   if (!argv.web3Host)
  //     argv.web3Host = process?.env?.NEXT_PUBLIC_RPC || "";
  //   if (!argv.privateKey)
  //     argv.privateKey = process?.env?.DEPLOY_CONTRACT_PRIVATE_KEY || "";
  //   return argv;
  // })
  .option(`web3Host`, {alias: `w`, string: true, desc: `RPC endpoint`,})
  .option(`privateKey`, {alias: `p`, string: true, desc: `Privatekey of account to be used on deploy actions`,})
  .demandOption(['w', 'p'])