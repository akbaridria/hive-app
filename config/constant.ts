import config from "./index";
const SUPPORTED_CHAIN_IDS = [4202];
const tokenImages: Record<string, string> = {
  [config.tokens.btc.ca]: "/tokens/bitcoin-btc-logo.svg",
  [config.tokens.idrx.ca]: "/tokens/idrx.svg",
  [config.tokens.lisk.ca]: "/tokens/lisk.png",
};

export { SUPPORTED_CHAIN_IDS, tokenImages };
