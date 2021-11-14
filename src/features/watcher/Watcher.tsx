import {
    Box, Flex,
    NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper, Select, Text
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    computePair,
    selectPair,
    updateAddress1,
    updateAddress2, updatePairAddress, updateResult
} from "../watcher/watcherSlice";
import { useState} from "react";
import { ChainId, Token, Pair } from "@uniswap/sdk";

enum TOKENS {
    DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    INCH = "0x111111111117dc0aa78b770fa6a738034120c302",
    LINK = "0x514910771af9ca656af840dff83e8264ecf986ca",
    WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    BAND = "0xba11d00c5f74255f56a5e366f4f77f5a186d7f55",
    USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
}

enum NETWORKS {
    RINKEBY = 4,
    MAINNET = 1,
    GORLI = 5,
}

type TokenAddresses = keyof typeof TOKENS;

const Watcher = () => {
    const dispatch = useAppDispatch();
    const pair = useAppSelector(selectPair);
    const [token1Value, setToken1Value] = useState(0);
    const [token2Value, setToken2Value] = useState(0);
    const [network, setNetwork] = useState(1);

    const changePair = async (token1:string, token2:string) => {
        const newToken1 = new Token(
            network,
            token1,
            18
        )
        const newToken2 = new Token(
            network,
            token2,
            18
        )

        const pairAddress = Pair.getAddress(newToken1,newToken2);
        return pairAddress.toLowerCase();
    }

    const handleChange = (e:any, isToken1:boolean) => {
        const { target } = e;
        pair.address1 && pair.address2 ? dispatch(updateResult('Input amount')) : dispatch(updateResult('Input token pair'));
        setToken1Value(0);
        setToken2Value(0);

        if (target.type === 'select-one') {
            const selectValue: TokenAddresses = target.selectedOptions[0].value;
            isToken1 ? dispatch(updateAddress1(selectValue)) : dispatch(updateAddress2(selectValue));
        }
    }

    const handleNetworkChange = (e:any) => {
        const { target } = e;
        if (target.type === 'select-one') {
            const selectValue = target.selectedOptions[0].value;
            setNetwork(selectValue);
        }
    }

    const compute = async (isToken1:boolean, amount:number, token:any) => {
        isToken1 ? setToken1Value(amount) : setToken2Value(amount);
        if (pair.address2 && pair.address1) {
            dispatch(updatePairAddress(await changePair(pair.address2, pair.address1)));
            dispatch(computePair(amount, isToken1));
        }
    }

    return (
        <Flex justifyContent={"center"} alignItems={"center"} bgGradient="linear(to-t, gray.700, gray.800)" flexDir={"column"} height={"100vh"} color={"whitesmoke"}>

            <Box width={500} bg={"blackAlpha.600"} height={350} p={10} borderRadius={40}>
                <Select placeholder="Select network" defaultValue={network} onChange={(a) => handleNetworkChange(a)}>
                    <option value={NETWORKS.MAINNET}>Mainnet</option>
                    <option value={NETWORKS.GORLI}>GÖRLI</option>
                    <option value={NETWORKS.RINKEBY}>Rinkeby</option>
                </Select>

                <Flex alignItems={"center"} mt={5}>
                    <Box bg={"blackAlpha.300"} px={4} py={5} borderRadius={20}>
                        <Select onChange={(a) => handleChange(a, false)} placeholder="Select token">
                            <option value={TOKENS.DAI}>DAI</option>
                            <option value={TOKENS.WETH}>WETH</option>
                            <option value={TOKENS.USDC}>USDC</option>
                        </Select>
                        {/*<FormLabel>{pair.token2symbol}</FormLabel>*/}
                        <NumberInput value={token1Value} min={0} onChange={(a, b) => compute(true, b, pair)}>
                            <NumberInputField type="number"/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                    <Box>
                        ↔️
                    </Box>
                    <Box bg={"blackAlpha.300"} px={4} py={5} borderRadius={20}>
                        <Select onChange={(a) => handleChange(a, true)} placeholder="Select token">
                            <option value={TOKENS.INCH}>1nch</option>
                            <option value={TOKENS.LINK}>LINK</option>
                            <option value={TOKENS.BAND}>BAND</option>
                        </Select>
                        {/*<FormLabel>{pair.token1symbol}</FormLabel> */}
                        <NumberInput value={token2Value} min={0} onChange={(a, b) => compute(false, b, pair)}>
                            <NumberInputField type="number"/>
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                </Flex>
                <Box bg={"blackAlpha.300"} px={4} py={5} borderRadius={20} mt={5}>
                    {pair.status ==="loading" ? <Text> Loading...</Text> : pair.result}
                </Box>
            </Box>
        </Flex>
    )
}

export default Watcher;