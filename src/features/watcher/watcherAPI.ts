import axios from "axios";
const baseUri ='https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';

export const fetchPair = async (address:string) => {
    return (await axios.post(
        baseUri,
        {
            query: `{
             pair(id: "${address}"){
                 token0 {
                   id
                   symbol
                   name
                   derivedETH
                 }
                 token1 {
                   id
                   symbol
                   name
                   derivedETH
                 }
                 token0Price
                 token1Price
             }
            }`
        }
    ))
}
