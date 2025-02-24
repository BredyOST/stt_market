import './donation.css';
import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import Form from 'react-bootstrap/Form';
import { ethers } from 'ethers';
import { Button, Modal, Toast } from 'react-bootstrap';

const extraTokenInfo = {
    usdc: {
        id: 8,
        label: 'USDC',
        icon: '/img/usdc.svg',
        contract: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'authorizer', type: 'address' },
                    { indexed: true, internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                ],
                name: 'AuthorizationCanceled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'authorizer', type: 'address' },
                    { indexed: true, internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                ],
                name: 'AuthorizationUsed',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_account', type: 'address' }],
                name: 'Blacklisted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newBlacklister', type: 'address' }],
                name: 'BlacklisterChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'burner', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Burn',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newMasterMinter', type: 'address' }],
                name: 'MasterMinterChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Mint',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'minterAllowedAmount', type: 'uint256' },
                ],
                name: 'MinterConfigured',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'oldMinter', type: 'address' }],
                name: 'MinterRemoved',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: false, internalType: 'address', name: 'previousOwner', type: 'address' },
                    { indexed: false, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
            },
            { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newAddress', type: 'address' }],
                name: 'PauserChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newRescuer', type: 'address' }],
                name: 'RescuerChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_account', type: 'address' }],
                name: 'UnBlacklisted',
                type: 'event',
            },
            { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
            {
                inputs: [],
                name: 'CANCEL_AUTHORIZATION_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PERMIT_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'authorizer', type: 'address' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                ],
                name: 'authorizationState',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
                name: 'blacklist',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'blacklister',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'authorizer', type: 'address' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'cancelAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'authorizer', type: 'address' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'cancelAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'minter', type: 'address' },
                    { internalType: 'uint256', name: 'minterAllowedAmount', type: 'uint256' },
                ],
                name: 'configureMinter',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'currency',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'decrement', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'increment', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'string', name: 'tokenName', type: 'string' },
                    { internalType: 'string', name: 'tokenSymbol', type: 'string' },
                    { internalType: 'string', name: 'tokenCurrency', type: 'string' },
                    { internalType: 'uint8', name: 'tokenDecimals', type: 'uint8' },
                    { internalType: 'address', name: 'newMasterMinter', type: 'address' },
                    { internalType: 'address', name: 'newPauser', type: 'address' },
                    { internalType: 'address', name: 'newBlacklister', type: 'address' },
                    { internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'string', name: 'newName', type: 'string' }],
                name: 'initializeV2',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'lostAndFound', type: 'address' }],
                name: 'initializeV2_1',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address[]', name: 'accountsToBlacklist', type: 'address[]' },
                    { internalType: 'string', name: 'newSymbol', type: 'string' },
                ],
                name: 'initializeV2_2',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
                name: 'isBlacklisted',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'isMinter',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'masterMinter',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
                name: 'minterAllowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [],
                name: 'paused',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'pauser',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'receiveWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'receiveWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
                name: 'removeMinter',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'contract IERC20', name: 'tokenContract', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'rescueERC20',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'rescuer',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'transferWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'transferWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
                name: 'unBlacklist',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [{ internalType: 'address', name: '_newBlacklister', type: 'address' }],
                name: 'updateBlacklister',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_newMasterMinter', type: 'address' }],
                name: 'updateMasterMinter',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_newPauser', type: 'address' }],
                name: 'updatePauser',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newRescuer', type: 'address' }],
                name: 'updateRescuer',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'version',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'pure',
                type: 'function',
            },
        ],
    },
    weth: {
        id: 2,
        label: 'WETH',
        icon: '/img/weth.webp',
        contract: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        decimals: 18,
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeBurn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeMint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'depositTo',
                outputs: [],
                stateMutability: 'payable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'string', name: '_name', type: 'string' },
                    { internalType: 'string', name: '_symbol', type: 'string' },
                    { internalType: 'uint8', name: '_decimals', type: 'uint8' },
                    { internalType: 'address', name: '_l2Gateway', type: 'address' },
                    { internalType: 'address', name: '_l1Address', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l2Gateway',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'sender', type: 'address' },
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'withdraw',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'withdrawTo',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { stateMutability: 'payable', type: 'receive' },
        ],
    },
    arb: {
        id: 3,
        label: 'ARB',
        icon: '/img/arb.svg',
        contract: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        decimals: 18,
        abi: [
            { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
                ],
                name: 'DelegateChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
                    { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
                ],
                name: 'DelegateVotesChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' }],
                name: 'Initialized',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MINT_CAP_DENOMINATOR',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MINT_CAP_NUMERATOR',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MIN_MINT_INTERVAL',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'burnFrom',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint32', name: 'pos', type: 'uint32' },
                ],
                name: 'checkpoints',
                outputs: [
                    {
                        components: [
                            { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
                            { internalType: 'uint224', name: 'votes', type: 'uint224' },
                        ],
                        internalType: 'struct ERC20VotesUpgradeable.Checkpoint',
                        name: '',
                        type: 'tuple',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
                name: 'delegate',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'delegatee', type: 'address' },
                    { internalType: 'uint256', name: 'nonce', type: 'uint256' },
                    { internalType: 'uint256', name: 'expiry', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'delegateBySig',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'delegates',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
                name: 'getPastTotalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
                ],
                name: 'getPastVotes',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'getVotes',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_l1TokenAddress', type: 'address' },
                    { internalType: 'uint256', name: '_initialSupply', type: 'uint256' },
                    { internalType: 'address', name: '_owner', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'nextMint',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'numCheckpoints',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
    },
    wbtc: {
        id: 4,
        label: 'WBTC',
        icon: '/img/wbtc.svg',
        contract: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        decimals: 8,
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeBurn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_l1Address', type: 'address' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'bridgeInit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeMint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'isMaster',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l2Gateway',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'sender', type: 'address' },
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
    },
    link: {
        id: 5,
        label: 'LINK',
        icon: '/img/link.svg',
        contract: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
        decimals: 18,
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeBurn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_l1Address', type: 'address' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'bridgeInit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeMint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'isMaster',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l2Gateway',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'sender', type: 'address' },
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
    },
    dai: {
        id: 6,
        label: 'DAI',
        icon: '/img/dai.svg',
        contract: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        decimals: 18,
        abi: [
            { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'usr', type: 'address' }],
                name: 'Deny',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'usr', type: 'address' }],
                name: 'Rely',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PERMIT_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '', type: 'address' },
                    { internalType: 'address', name: '', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'usr', type: 'address' }],
                name: 'deny',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'deploymentChainId',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'usr', type: 'address' }],
                name: 'rely',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'version',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'wards',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
    },
};

const tokenList = {
    stt: {
        contract: '0x1635b6413d900d85fe45c2541342658f4e982185',
        abi: [
            { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_addr', type: 'address' },
                    { internalType: 'bool', name: '_bool', type: 'bool' },
                ],
                name: 'addWL',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                name: 'addressesList',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'burnFrom',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                    { internalType: 'uint256', name: 'bps', type: 'uint256' },
                ],
                name: 'calculate',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'pure',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'pure',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'emission',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'uint256', name: '_amount', type: 'uint256' },
                    { internalType: 'address', name: '_addr', type: 'address' },
                ],
                name: 'feeDistribution',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                name: 'feeList',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [
                    { internalType: 'address[]', name: '_addressesList', type: 'address[]' },
                    { internalType: 'uint256[]', name: '_feeList', type: 'uint256[]' },
                ],
                name: 'setAddressAndFee',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_addr', type: 'address' }],
                name: 'setExchangeAddress',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: '_fee', type: 'uint256' }],
                name: 'setFee',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        decimals: 9,
        target: '0x11F2754320C961f4fFbC0174C8B4587903F816Dc',
    },
    usdt: {
        contract: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_user', type: 'address' }],
                name: 'BlockPlaced',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_user', type: 'address' }],
                name: 'BlockReleased',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: '_blockedUser', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: '_balance', type: 'uint256' },
                ],
                name: 'DestroyedBlockedFunds',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: '_destination', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'Mint',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_contract', type: 'address' }],
                name: 'NewPrivilegedContract',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'Redeem',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_contract', type: 'address' }],
                name: 'RemovedPrivilegedContract',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_trustedDeFiContract', type: 'address' }],
                name: 'addPrivilegedContract',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
                name: 'addToBlockedList',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_owner', type: 'address' },
                    { internalType: 'address', name: '_spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeBurn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeMint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_blockedUser', type: 'address' }],
                name: 'destroyBlockedFunds',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'string', name: '_name', type: 'string' },
                    { internalType: 'string', name: '_symbol', type: 'string' },
                    { internalType: 'uint8', name: '_decimals', type: 'uint8' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'string', name: '_name', type: 'string' },
                    { internalType: 'string', name: '_symbol', type: 'string' },
                    { internalType: 'uint8', name: '_decimals', type: 'uint8' },
                    { internalType: 'address', name: '_l2Gateway', type: 'address' },
                    { internalType: 'address', name: '_l1Counterpart', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'isBlocked',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'isTrusted',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l2Gateway',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_destination', type: 'address' },
                    { internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address[]', name: '_recipients', type: 'address[]' },
                    { internalType: 'uint256[]', name: '_values', type: 'uint256[]' },
                ],
                name: 'multiTransfer',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'redeem',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
                name: 'removeFromBlockedList',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_trustedDeFiContract', type: 'address' }],
                name: 'removePrivilegedContract',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_recipient', type: 'address' },
                    { internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_sender', type: 'address' },
                    { internalType: 'address', name: '_recipient', type: 'address' },
                    { internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        decimals: 6,
        target: '0x11F2754320C961f4fFbC0174C8B4587903F816Dc',
    },
    usdc: {
        contract: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'authorizer', type: 'address' },
                    { indexed: true, internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                ],
                name: 'AuthorizationCanceled',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'authorizer', type: 'address' },
                    { indexed: true, internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                ],
                name: 'AuthorizationUsed',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_account', type: 'address' }],
                name: 'Blacklisted',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newBlacklister', type: 'address' }],
                name: 'BlacklisterChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'burner', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Burn',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newMasterMinter', type: 'address' }],
                name: 'MasterMinterChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Mint',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'minter', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'minterAllowedAmount', type: 'uint256' },
                ],
                name: 'MinterConfigured',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'oldMinter', type: 'address' }],
                name: 'MinterRemoved',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: false, internalType: 'address', name: 'previousOwner', type: 'address' },
                    { indexed: false, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
            },
            { anonymous: false, inputs: [], name: 'Pause', type: 'event' },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newAddress', type: 'address' }],
                name: 'PauserChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'newRescuer', type: 'address' }],
                name: 'RescuerChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: '_account', type: 'address' }],
                name: 'UnBlacklisted',
                type: 'event',
            },
            { anonymous: false, inputs: [], name: 'Unpause', type: 'event' },
            {
                inputs: [],
                name: 'CANCEL_AUTHORIZATION_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PERMIT_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'RECEIVE_WITH_AUTHORIZATION_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'TRANSFER_WITH_AUTHORIZATION_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'authorizer', type: 'address' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                ],
                name: 'authorizationState',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
                name: 'blacklist',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'blacklister',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'authorizer', type: 'address' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'cancelAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'authorizer', type: 'address' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'cancelAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'minter', type: 'address' },
                    { internalType: 'uint256', name: 'minterAllowedAmount', type: 'uint256' },
                ],
                name: 'configureMinter',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'currency',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'decrement', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'increment', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'string', name: 'tokenName', type: 'string' },
                    { internalType: 'string', name: 'tokenSymbol', type: 'string' },
                    { internalType: 'string', name: 'tokenCurrency', type: 'string' },
                    { internalType: 'uint8', name: 'tokenDecimals', type: 'uint8' },
                    { internalType: 'address', name: 'newMasterMinter', type: 'address' },
                    { internalType: 'address', name: 'newPauser', type: 'address' },
                    { internalType: 'address', name: 'newBlacklister', type: 'address' },
                    { internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'string', name: 'newName', type: 'string' }],
                name: 'initializeV2',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'lostAndFound', type: 'address' }],
                name: 'initializeV2_1',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address[]', name: 'accountsToBlacklist', type: 'address[]' },
                    { internalType: 'string', name: 'newSymbol', type: 'string' },
                ],
                name: 'initializeV2_2',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
                name: 'isBlacklisted',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'isMinter',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'masterMinter',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_amount', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
                name: 'minterAllowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            { inputs: [], name: 'pause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [],
                name: 'paused',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'pauser',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'receiveWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'receiveWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'minter', type: 'address' }],
                name: 'removeMinter',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'contract IERC20', name: 'tokenContract', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'rescueERC20',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'rescuer',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'bytes', name: 'signature', type: 'bytes' },
                ],
                name: 'transferWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'validAfter', type: 'uint256' },
                    { internalType: 'uint256', name: 'validBefore', type: 'uint256' },
                    { internalType: 'bytes32', name: 'nonce', type: 'bytes32' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'transferWithAuthorization',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_account', type: 'address' }],
                name: 'unBlacklist',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { inputs: [], name: 'unpause', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [{ internalType: 'address', name: '_newBlacklister', type: 'address' }],
                name: 'updateBlacklister',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_newMasterMinter', type: 'address' }],
                name: 'updateMasterMinter',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '_newPauser', type: 'address' }],
                name: 'updatePauser',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newRescuer', type: 'address' }],
                name: 'updateRescuer',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'version',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'pure',
                type: 'function',
            },
        ],
        decimals: 6,
        target: '0xf5B4001A2aEe3821419576B1E9D96d160c69B901',
    },
    weth: {
        contract: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeBurn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeMint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { inputs: [], name: 'deposit', outputs: [], stateMutability: 'payable', type: 'function' },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'depositTo',
                outputs: [],
                stateMutability: 'payable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'string', name: '_name', type: 'string' },
                    { internalType: 'string', name: '_symbol', type: 'string' },
                    { internalType: 'uint8', name: '_decimals', type: 'uint8' },
                    { internalType: 'address', name: '_l2Gateway', type: 'address' },
                    { internalType: 'address', name: '_l1Address', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l2Gateway',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'sender', type: 'address' },
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'withdraw',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'withdrawTo',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { stateMutability: 'payable', type: 'receive' },
        ],
        decimals: 18,
        target: '0xf5B4001A2aEe3821419576B1E9D96d160c69B901',
    },
    arb: {
        contract: '0x912CE59144191C1204E64559FE8253a0e49E6548',
        abi: [
            { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
                ],
                name: 'DelegateChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
                    { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
                ],
                name: 'DelegateVotesChanged',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' }],
                name: 'Initialized',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MINT_CAP_DENOMINATOR',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MINT_CAP_NUMERATOR',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'MIN_MINT_INTERVAL',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'burnFrom',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint32', name: 'pos', type: 'uint32' },
                ],
                name: 'checkpoints',
                outputs: [
                    {
                        components: [
                            { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
                            { internalType: 'uint224', name: 'votes', type: 'uint224' },
                        ],
                        internalType: 'struct ERC20VotesUpgradeable.Checkpoint',
                        name: '',
                        type: 'tuple',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
                name: 'delegate',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'delegatee', type: 'address' },
                    { internalType: 'uint256', name: 'nonce', type: 'uint256' },
                    { internalType: 'uint256', name: 'expiry', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'delegateBySig',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'delegates',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
                name: 'getPastTotalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
                ],
                name: 'getPastVotes',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'getVotes',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_l1TokenAddress', type: 'address' },
                    { internalType: 'uint256', name: '_initialSupply', type: 'uint256' },
                    { internalType: 'address', name: '_owner', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'nextMint',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'numCheckpoints',
                outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        decimals: 18,
        target: '0xf5B4001A2aEe3821419576B1E9D96d160c69B901',
    },
    wbtc: {
        contract: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeBurn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_l1Address', type: 'address' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'bridgeInit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeMint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'isMaster',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l2Gateway',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'sender', type: 'address' },
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        decimals: 8,
        target: '0xf5B4001A2aEe3821419576B1E9D96d160c69B901',
    },
    link: {
        contract: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
        abi: [
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                    { indexed: false, internalType: 'bytes', name: 'data', type: 'bytes' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeBurn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_l1Address', type: 'address' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'bridgeInit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'account', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'bridgeMint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'isMaster',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l1Address',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'l2Gateway',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '_to', type: 'address' },
                    { internalType: 'uint256', name: '_value', type: 'uint256' },
                    { internalType: 'bytes', name: '_data', type: 'bytes' },
                ],
                name: 'transferAndCall',
                outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'sender', type: 'address' },
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
        ],
        decimals: 18,
        target: '0xf5B4001A2aEe3821419576B1E9D96d160c69B901',
    },
    dai: {
        contract: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
        abi: [
            { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Approval',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'usr', type: 'address' }],
                name: 'Deny',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [{ indexed: true, internalType: 'address', name: 'usr', type: 'address' }],
                name: 'Rely',
                type: 'event',
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                    { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                    { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'Transfer',
                type: 'event',
            },
            {
                inputs: [],
                name: 'DOMAIN_SEPARATOR',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'PERMIT_TYPEHASH',
                outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: '', type: 'address' },
                    { internalType: 'address', name: '', type: 'address' },
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'approve',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'burn',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'decimals',
                outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
                ],
                name: 'decreaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'usr', type: 'address' }],
                name: 'deny',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'deploymentChainId',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
                ],
                name: 'increaseAllowance',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'mint',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'name',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'nonces',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'address', name: 'spender', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                    { internalType: 'uint8', name: 'v', type: 'uint8' },
                    { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                    { internalType: 'bytes32', name: 's', type: 'bytes32' },
                ],
                name: 'permit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: 'usr', type: 'address' }],
                name: 'rely',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'symbol',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [],
                name: 'totalSupply',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transfer',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [
                    { internalType: 'address', name: 'from', type: 'address' },
                    { internalType: 'address', name: 'to', type: 'address' },
                    { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                name: 'transferFrom',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            {
                inputs: [],
                name: 'version',
                outputs: [{ internalType: 'string', name: '', type: 'string' }],
                stateMutability: 'view',
                type: 'function',
            },
            {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'wards',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        decimals: 18,
        target: '0xf5B4001A2aEe3821419576B1E9D96d160c69B901',
    },
};

const arb_icon =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAACAZSURBVHgB7d1/jJXVncfxwy+HXx1sEWZtcVQoqEXc7qjUn5XFH4BiRLOwZbRZCESzYklqrWuyaWW7f6zZGt00tU03WGmyHY2YFoPaStVqq0JRSAtiRSrqaK382BUGhplhBtj7vXDpcOfeuc+593nO95zneb+SCVYHeyJ3Pve55/s93zNgXNOsIwYA4J2BBgDgJQIaADxFQAOApwhoAPAUAQ0AniKgAcBTBDQAeIqABgBPEdAA4CkCGgA8RUADgKcIaADwFAENAJ4ioAHAUwQ0AHiKgAYATxHQAOApAhoAPEVAA4CnCGgA8BQBDQCeIqABwFMENAB4ioAGAE8R0ADgKQIaADxFQAOApwhoAPAUAQ0AniKgAcBTBDQAeIqABgBPEdAA4CkCGgA8RUADgKcIaADwFAENAJ4ioAHAUwQ0AHiKgAYATxHQAOApAhoAPEVAA4CnCGgA8BQBDQCeIqABwFMENAB4ioAGAE8R0ADgKQIaADxFQAOApwhoAPAUAQ0AniKgAcBTBDQAeIqABgBPEdAA4CkCGgA8RUADgKcGGyBAjWdPNmMbzzj+a93wEfkv0XWg3ezdvcu07d5pdrS+Zz54a4tpzX0BoRkwrmnWEQMEYGgugM+/5jpzQe6rEMZR7c2F9QdvvWleWfV4/q+BEBDQ8F4twVzKGy+/SFAjCAQ0vBV3MPcm4VwIasBXBDS8dO5l08ylc+aZUaeMNUmSoJaQlrAGfENAwytS9JNgPi33q0sS1C+0PGK2bXzNAL4goOGFsY1nmiubFzgP5mJ/2rjePN+ygv1peIGAhirZZ57evDC/peETConwAQENFUkWAONU2J8mqKGBgIZzF1wzO7fPPNfrYO6NQiK0ENBwRgqAsxYvSbwzIykENVwjoJE4rc6MpOxsfdf8/HvfZdsDiSOgkRh5UpZg9q0AGBcKiUgaAY3YhVIAjAtBjaQQ0IiNdjDLFDuh8f/N0XEkgYBGLCY2TTXTmxeoFABlnKgEY2GkqBx6ka2ViU0XGtcoJCJOBDRqolkAlDD8xfKHys561nzTqLQ2IAoCGlWR0Lt28RKVYJatDHlKfX3N05G+f0quSHmJg8FLpbA/jVoQ0LAi+8wSdrLP7JoEs4TyhtxX57H9ZhuFjhKCGqEgoBGJdgFww5qncgG3sqpg7k279U9Cuto3GGQPAY2KJMyubF6oEsxSAJTpcnI4JE6aQU0hEVER0ChLCoAyaU4uZXWtuDMjKdLxcePSb6oVEglq9IeARh/anRmv5kJrs+PQ0iwkypvRM8sfYn8afRDQOE7zY3+tBcC40PEBnxDQUC8A+lY4k3Au3ImoQf5byJsVQQ0COuM0ZzP7/tFeu5BYCGpkFwGdUZqzmV0VAOOieSiHQmK2EdAZ4/PRbN9p7k9zdDybCOiMCOlotu8oJMIVAjrlCgVAjYKXL50ZSZA9+wvyhdXZub8eblwjqLOBgE4p7c6MrASID62JzKBOLwI6hQotYhQA3eHoOJJAQKeIZgFwZ+t75oWWRzJfxNLsjiGo04eATgGZJ3Fl8wK1AqAE82ZC4QQcHUccCOiAyT6zDDPK8tFs3zGDGrUgoAOUltnMWeHDDGoJa4I6PAR0YDiaHS4KibBFQAeCo9npIX+GNy69W2XONkEdFgLac1mczZwV2kfHV33vP82O1vcM/EVAe4rZzNnB0XGUQ0B7RrMASDDr0Z5BTVD7iYD2hHZnxraN680LLSv4AVWmXUgsBDX8QEB7YGLTVDO9eQEFQBwnrwXpcZ/YdKFxjUKiPwhoRcxmRiXahUQ5Jbpt42sGOghoBcxmhi0KidlEQDsk+8zyQyb7zK5RAEwHjo5nCwHtgA+zmeWjKsGcDhwdzw4COmHyQ3RlrtijdTSbAmB6cXQ8/QjohEgBUKrwGsd5CeZsYQZ1ehHQMeNoNrQwgzp9COiYcDQbvqDjIz0I6Boxmxk+knAuvC41ENTxIKBrwGxm+E67kCif6ui5rx4BXQVmMyM0moejKCRWj4C2INsZEswyO8M1jmYjDuxPh4WAjkhe0F+5Z5nzF3ahAMiEMcRJK6glnB+7bxkhHREBHYFGONOZgaRJ7USKiK5nUMtr+7H77uU2lwgI6Ao0wpmPgnBJo5AoIb3i29/kNV4BAV3Bbff/wFk4UwCEJtdBLeH8k1xI8wmxvEH1p05cZlCSvFhdFAR35j7qrf7hg8eemncZQIM81crNOvKgIN0eQxNuH5V//+AhJ5l3N//eoDQCugx5mrhx6d0mSfID8ZuVPz3Wz0wwww/yWpTaR1vuCVdmySQZ1J+dMCn/hsDrvzS2OMq4dvEdiX3US2sBsP5TI8yoT400405tMElp29dutrz9jqlWCGv0TdIzqCWgH80VDdHXYIM+CjcsJyGtR7O/ftvNZvH8OfkATJqE38z5XzO2QlijjwqHTJLan5btFDn8Re2lL7Y4Sphy2d+bM6d80cRJnhKk//OPv3vF9HR3mzS5965bzZIF80xd3UnGhbGjP2PWbdhsPvzLjsi/R2ONa15aZ3b97ycmDQr70xLUsuUR9xhd+fezF93XQIM+4nxKOBrM9+Y/wqWxpWjcZxvyT6Wute2P/glEbY379pu0kdfwM8u/b3501+354nZcPq9wOjcEbHEUqYvp6SArs5kXzb/BuLbl7e1my9boe7x33nqzcU3W+MFH0Z/wQyOv7xXfviu2E4ny++WLvugTEdBFGmII5yyNAJ057WLj2sMtq6y+/+LzpxjXbNcYKnkA2Xxsf7rWE4kNjacT0EUI6CK1jg6VPbrnW1aYLLj4/PPy2weuyf5zVDOmXeT9GtNAComFo+PVOklhbK/v2IMuUjd8uKnFGy//2mTF3OuvMq6tXP2c1dbB3OuvNq7ZrjEtah0nqjFhz3cEdMyy0nAvT6VaAR2VrHGGwhaMzRrTpIsj27EjoFEVjX3dD3NPpWs3bIr8/SGsEegPAY2qLFJoW/vli2utvl+je+PxjD49IxkENKxNnjTeTD5rvHHtx48+Gfl7ZY0axcEnniKgER8CGtYWNbt/el77+iarwlsIawQqIaBhTWNvd6Xlk2kIawQqIaBhRTo3XG8dyHQ4m84IjTVKcTCr3RtIDgENKxqtdc9aFgc11rg2YwdT4AYBjcjkqVROD7pm2/usscaHLQqYQFQENCKbcYX7Qx+2fcVzZ7t/epY12gxvAqIioBHZ4mb3k+se+O+fWn3/PIXtDds1AlER0IgkhMFIIawRsEFAIxKd4uA6y8FI/g9vAmwQ0KhI7vDTCb9fRf5ereFNth0mgA3mQaMijYlwUnizCT+twUg2azx0coPZf+HRffyRrz1pBu3hyRv9I6BRUQh9xRrDm2zXuPsfvmW6G47OMGk/72pz6kMLzIBORnSiPLY40C+tvuIHLTojZI0aw5ts1tj9N+OPh7M4PHREPqSB/hDQ6JfGyE7boUMhrHH/hX2f8DsmXWSA/hDQ6BeDkUqzXWPX6VNK/L3zTM/J7tsCEQ4CGmVpXbhqU3jTGt5ks8YD511lekY1lP1nQDkENMrSunBVAjAqjQ4TCWebNbb3E8Kltj6AAgIaJYVw4WoIa5TWOtnKKEeKhf39c2QbAY2SuBS2NNs1djVWXmPb5c0GKIWARkkanRHLW+xGdmqs0XYwUtuXK6+xu2GCOZJ7kgaKEdDoQ2vo0JqXbE4O+j8YKd+lMaryGumJRjkENPpQOTlo2VccwvAmmw4NeqJRCgGNPlQKbxZ9xTK8Sad749XI3ytPxR2Toq9RnrYpFqIYAY0TyJOpBKBLtheuSjj7vsbOXDgfttxX7uQpGkUIaJwghMFIIayxvYoDKLIPTbEQvRHQOC6EC1dDGN5Uqfe5nHxPdCPbHPgrAtqgYNF893cObnl7u9WFqxqtdbJGm+Jg2+XVr3HfVPd/BvAXAY3jZioU3h5uWWX1/RqHU2zXWGowUvTfex7bHDiOgEZeCH3FWsObbNbYcdZFkXqf+7NvKvM5cBQBjbwQLlydMe0S45rtGjsn1b5GBiihgICG2oWrtoORfF+jFAfbYxgfygAlFBDQYDBSGUkMRoqqnTnRMAQ0TBgXrmp0bzy+2u7WlCiDkaKSgy4UC0FAZ9zkSeO9v3BV1qhRHHzC4vi5XApba3GwNwYoQRDQGbeoWeHp2XIwUghrTKKwxwAlENAZx6WwpcVxKWytGKAEAjrDQrhwVWONtoOR+rsUtlZJBD/CQUBnmM5MZbsLV9M6GCkqeqKzjYDOKK2hQ7a9z76vsdrBSFHRE51tBHRGhdBXPHe2+6dn2zW66FfmUtnsIqAzKoQLV+cpbG/YrvGAg4BmgFJ2EdAZFMJgpDRdChsHBihlEwGdQSFcuJq2S2Fr1TnJ/ShY6COgMyaEC1f1BiP9KvL3Hj3p526NBxvGUyzMIAI6Y0K4cFWrgGnTn93dMMG4xqWy2UNAZ0wIfcUhDG8a2LXfuMalstlDQGdICBeuyhp9H94kBu3ZYQZ2Rj9wEwcGKGUPAZ0hIVy4qrFG28FIQsJ5+Oboe9ZxYYBSthDQGRLChashDEYqGLZ1nXEt39p3svv2Q+ggoDMihAtXQxje1Fvd+5vyX64d4LaVzCCgM2Lu9e73Lu0vhdVo/7Mb3lRs2Nvun6IZoJQdBHQGyFOpRvjZDkbyfY2lDN/0K5ViIT3R2UBAZwCXwpZmu8ZSJJzrWt1vczBAKRsI6AwI4cJVjTUub3nSxGHk+nj+PTbkoAw90elHQKec1tAhmwtXtda45qXqioPFpFBITzSSQECnnMrJQcu+4hDWWMnI1+zaCeNAT3T6EdAp53tfsdbwpmp7n8sZud59QHOpbPoR0CkWwoWrIQxviiJfLFToiWaAUroR0CkWwmCkENYY1YhN8YZ+FAxQSjcCOqW0BiM9/Gj0joYQ1mhj6NtrdXqiG9nmSCsCOqW0LlzdsvWdyN+vNbzJZo02tAYo7Zt6g0E6EdApFcKFqyEMb7KlNUCJbY50IqBTiEthy1uX0P5zgdYAJS6VTScCOoV07vN7zvveZ9s1VquuNdk3gVIYoJROBHTKaF24ajOyU+9S2OhdFrJlsOuW+8yH//qM+fiOR8whixnMGj3RDFBKJwI6ZUK4cDWEwUgdky4+Hng9oxrMnqtui/x7tXqi25kTnToEdMqEcOGqxhp/aTmUv+3LJ3aYdJ0+xaoQV//bFuNaZ+5NhWJhuhDQKRLChauTJ41XWeOPLXqf89dKjTpxS8N2OBEDlBAHAjpFQrhwdVGzwhO+5RrLXSllO5yIAUqoFQGdIiFcuBrCGmU7o/TftxtONGxrPONMbTBAKV0I6JQI4cJVrTXadG/I03Px9kZvNsOJhuzYrlIsLPcGg/AQ0CkRwoWrvrf/iUqdELbDibhUFrUgoFMglEthNQYj2axRep0rbQ9IIe5gwwQTFZfKohYEdAqE0Fc84wr3byC2a4zaR2xzYavWACUulU0HAjoFNLo3bAcjLW52P3HNdo0HIga07XAiBiihWgR04BiMVJ7NGkv1PvfHZjiRFAoH79lpXGOAUvgI6MDpFN7WeT8YyXaNByyPSdt+v8Y2h5wsRNgI6IBpXbj67IuvRv5eWaPOYKTogSjFQds5FvK0bVOI0xigdLBhPMXCwBHQAQvhwlWNNxDb4U1djdUVWW16orlUFtUgoAPGpbCl2a6x2r1a255ojQFKXCobNgI6UFp9xTaDkUJYo2xvdDdUN7zJdjjRkB3vMEAJVgjoQGlduGpTeAtheFPb5bWtscNym0OjWMgApXAR0IEK4cLVkAcjRf/95+WewKOfLNTqie452X2bI2pHQAdoxrSLvO8r1lqjTXGw0mCkqDrOiv6EqnWp7AFuWwkSAR2gGdMuMa7ZXwrrft9T1mgzvKnjrHg6TGyHEzFACVER0IEJ4cLVEIY3SXGwI6aDHLbDiRighKgI6MCEMBgphDVW2/tcju0ApbpW99scDFAKDwEdGI3OiMdX2xXeNNa4vCX6nYOi+FLYWtkOJxq53m69cZBiJj3RYSGgAyIXrmoU3p6w6IzQGoy05iWLk4OWg5Gish2gRE80KiGgAxLChasqJwdjuhS2VrbbJlwqi0oI6ICE0FesUhy0WKM8RXYkNOXN9sJWjQFKXCobFgI6EBoXrtoORpI1+j68SUZwHk5wH5YBSogTAR0IBiOVZrvG9oQPbIRwqSwDlMJBQAcghAtXtdb48KPRuyGiXApbq/wWisUBGLWe6Ea2OUJAQAdg7mz3T6a2fcWL5ru/c1CGN23Z+k7k7691MFJU7VOi/3lpDVDaN9X9nxfsEdABmKewdWB74epMheKg7fCmWgcjRf//4VJZxIOA9hyXwpZns0YZaJRE73M5tj3RQ3ZsN65xqaz/CGjPcSlsabbDmzonuR0wZT9AKfpBm7gwQMl/BHTMRp0yxsRFbzBS9D3REIY3iZ5RY41LtsOJNHqi4x6gVDecLZO4EdAxm9g01cRFa+iQzUzlEAYjicF7dxrXbJ5QtXqi42w7vOCa60wt9u52/2fkOwK6yM7W900tzs+9SC+dM8/EYdF8haPdln3FIaxRDN9k98QdBylK+n6prBzcqbVYODT35Dy9eaE597JpphZtu3cZnIiALhLHu7gE9G33/6CmF6xsHUw+q7rLTGthc+GqDG/yfY0FIQwnCnGAkrzG/+k736356VnsJaD7IKCLdB1oNx+8tcXUatQpY821i+8wC3Iv3obGM4ytEC5cDWF4U28hDCcKZYBS49mTzfx7/i3/GpfXeq3kwYgtjr4I6BJaYwjogrGNZ+aeMO63fiGHMBgphDX2NuIPGtscdsOJhm11381hs0Z5DUswfyX3dVoupOPywVtvGvRFQJfw+pqnTdzko6Bse0QJao3BSHKXn01xMIQ1Fhu0d4f3w4mkH1pjjZUO8RT2meU1HGcwF7yy6nGDvgjoEuLa5ihFgvor9yzrt5CoMbJTgs/mwlWd/my7NZYSwnAiny6VlWAu1FTi2GcuRX7W2N4ojYAu4/mWFSYp8gRdrpAYwoWrIQxvKkdrONHBhgmRv9+XS2UvuGZ2/jUqr9Uke5xfaHnEoDQCuoydre8mstXRW6GQKD8EE5suzP+9EPqKZ1zh/g2kmt7nUrSGE9leKqu5RikALsjVTaY3L0j88MkbL79odrS+Z1DaYIOyZF9MgjOOKnV/5N9/49J/yb9Y77zhfOOa7YWri5vdT0J7oIrWunJkOJHrY86F4UQDIj4Za6yx8exzzZyYi3/9kW0Nnp77xxN0P2Qv+rH7ljnbH5sxY7r3F66GMBipkhCGE7nsiR495Ii5peGg+dq4TmfhXPjZ6jzgdisnNAR0BRLOrkL6nE+7/0ATwqWwtsObotAYTmR7WW3SPdHDBx4xs0Z3m7sbO83U+h7jioTzow4ffEJGQEfgIqTrBg0w4+sHGdds+orlvkHfhzdFpTGcSMad+jJASYL53jM7zazPdJthuaB2RX6GJJylxoPKCOiICiEt+8RJkHCWkHbJ9sJVje4S2+FNUYVwYWsSa5w47LBZdkaH82AW0k73GOFshSKhBQnpZ5Z/P/dCe8NcMmderMVDle2NFF4Ka0OGE+063W27oPRE1//2p5GLhbLNEcdIUAnmWaMPms/nfnVNfm5ezRXcNyf0cJNmBHQV5IUmX1MumxZLUNcPGWA+N8L9hxmbC1e1ep8fjLF7o1ihEHfY4dVPheFEUbcv6t7fXNMapQB4c0OXSjDLXrO0qm7IfVEMrA4BXQMJ6da33swfNqllxOjUhiHGNdsLVzWGN8ka4y4OFpMnVFeXyRbIcKKoAV3oibZtuZMC4MzcPvO0k90V/3qTFlWCuXYEdI3k45u8GGVvWkK6mhGjKk/PlheuahygsV1jNeQJ1VxunJIti+6GCWbIjmhvkDY90RLMV3y6Jx/MrveYhewzP7P8ITo0YkJAx6SwPy1hfe3iJZH7SSWc609yH9A2fcUzpl0UfO9zObLNIV9djvei5RLbqAEddY1fqu/JF/8+M0QnmOW135rQDJusIqBjdrSN6N7I+9MaxUHbC1fnXl/9QPdq2a6xFjKcyHVAyxNx/W+i76/3t0btAuAvck/MBHMyCOiERCkkSnFQK6CjCmF4U61kOJHsQ7suFkrgRm2jK7VGzWCWAqA8MSc9rybrCOiEFYJa9qdlOljd8OHH/9nnRro/mGI7dCiUS2Frke83bt2UK965fSOS4URjIga0rFG2RCTUZZ/5pjHdTk//FdCZ4RYB7UipQuLfjnb/n/+Xloc+NLo3Hl/t/uaTkeufdB7QtgOUxmxYZaY0naNWAJTXr7yOKQC6Q0A71LuQOGvuP5oxU2YZ1w40NuXfIKKciNQajPTEU+4DWqMnWkTtiZZPX5fOmZv7BNZtXKMAqGdQ/akTlxk4JR8T33h9fb5LQbYQ6j810rjw4f7D5q2Ok8zEpqn5kJZ17OxnFu+dt93s/NZuGd5kc4AmTkeGnOS8WHhk8BAzYlP5NySZzSz3/53zpUvN4Nz6XJLXxuofPnjsqZkbtzUMGNc0y/1nJZxAjlDLVkLST6vPfXjQ/PGTE/ct++tbXbv6EedP0Hcue8BpgbA3eXr+6BsrjWtj/ueePsVCCWbZDnM1/rM3eeOWOc0czdbHE7QH3nx7e/6pUUYlnZYLxCSeqLsOHTHPfnCwz9+X7hK5a05+lSemrmOFH3nTcN1eJ8XBO5c9aLQM6OnOX5566GS3b0qDOvebods35P/66C07S8wVc29J/KKIYvJn/7unV+Wemv/LfPTONgN9BLRHZDDQsy+tM6NyAR331sK2vYfM9rZDZf/52MYz8kEtl4T+318+MvfcfnP+zcIlmfucxOQ6GwO79puOL1xhXOoZfZoZvfU35qIZ1+XDeWzjmca1DWueMj//3nfNu5t/b3q63e9zozS2ODwlWwuy7RHXBLmfbe80f26P1i97ZO9us/SyRuPazOavWc0HSYJsc3y8ZIWzYmHhaPb0oXsSv/+vFI5m+42A9pwE9fL7v1XTE3XbwSPmJ1s7In//1LFDzJccD3CS7Y2Lr19ofLDnmlud3AfI0WxUQpud5yS4ZjbfUVMhcf1Ou4+s53za/QGaBxIcK2or6Qtbmc2MqAjoQEhng3xVE9Qfth+K/L0hDG9KWlIDlJjNDFsEdGAkpKWYOG/2Vebrt1U+5be9rcfsOxj9I3QIw5tcqGvdHFtAa85mJpjDxp2EAZJtD9kSkD3bSj3Df/wk+tOz1vAm7c6NUuK4sLVwa7ZczqoRzts2rjcrvv3N/F4z4RwmioQpINsdy75xa5+pc7bFQQnnq8a5Pa3mU3Gw2K5b7qv6KVoKgDLQSGtoPgXAdGCLIwUk5BZ/49/77E//2WLvWWgMb1rr0d5zsWoulZUC4E1juszn6twHM7OZ04cn6BQqBPVz++oj7z+fMnSgmT9xqHHtktzTs2/7z73J0e8oPdHMZkYSeIJOoULHR2G0aZQjw188ReHp+fVNXoezqHSprHRmSC8zs5mRBAI6xWwus9W4uHblUzpDkWwM27q2ZEBrX84qf64y0IhgTje2ODJCnqLLBbVGcbBtX3uuOLgg/6vviouFs461zGkVAJ9vWWF2tr5rkH48QWdE4bKAN17+tZm1eMkJ2x7j692fHJTWuhDCWRQubJV9ZjlowtFsuEJAZ4z8gP/ortuPX2Z72qkNKgG9Zu0fTCjOPviRmTquk6PZcI5xoxkls5/zxaU9u83F505wdquLkP7sj0/9Yp8Z1L6R9d209G5z2ewbnT81F2YzS9scs5mziz1o5PumvzrvBnP7V5Of4CaKb3bx7TJSmYl9Sf4W9uuMBpnN/MqqlRQAQUDjr+KeQV3Oiq0dffqzJZwLQa1Fgvn8XChLMDObGT4goNGHBPV/fOvrZtrU+C9QleFNT79/sOw/l3AqtAe6JN0t0uXi+popQQEQ5RDQKOuGa68y9/xzvJfZlrq4thQJaunz3bbxNZMkzctZOZqNSghoVBTXreO2w5tEUvvTcu/flc0L1G7NlhOAmts5CAMBjUhkT3bJLXPMooXzqx7oL0/O8gRdjbiCWvaZpzcvrHiyMgkczYYtAhpWaikklioO2irsT9sGtXYB0LdOFYSBgEZVbIN6d8dh8+ifOk0cbAuJF1wzO7fPPFetM4MCIKpFQKMmTX83xTz0nTsr7k9HLQ7aqBTUUgAsPtbuihzAkSInwYxaENCIRaVCYhzbG+UUP6VqdmYwmxlxIqARq8ULm82im64+IahrKQ7aKBwZ19jKoACIJBDQiJ2E85JFzeaWOVfn//fPtneaP7e7HzTkCkezkRQCGokpBPUnEy41acTRbCSNgEbipEh349K7zdjGM0wa0JkBVwhoOFOYQa3RVREHZjPDNQIazoUW1BQAoYWAhgoJ58IEOV8RzNBGQENVf5fZatq2cb15oWUFBUCoIqDhBQlqGWI0selCo4kCIHxCQMMrWvvTzGaGjwhoeMlVUHM0Gz4joOG1wv503EFNARAhIKDhvbgLiTL9TibNEczwHQGNYBSC+rSzv2D9RC1PzBLM8tRMZwZCQUAjSDJSVMaJyq8yva74GHlbLoR3tL6X+3VXvmWO4h9CREADgKequ/0TAJA4AhoAPEVAA4CnCGgA8BQBDQCeIqABwFMENAB4ioAGAE8R0ADgKQIaADxFQAOApwhoAPAUAQ0AniKgAcBTBDQAeIqABgBPEdAA4CkCGgA8RUADgKcIaADwFAENAJ4ioAHAUwQ0AHiKgAYATxHQAOApAhoAPEVAA4CnCGgA8BQBDQCeIqABwFMENAB4ioAGAE8R0ADgKQIaADxFQAOApwhoAPAUAQ0AniKgAcBTBDQAeIqABgBPEdAA4CkCGgA8RUADgKcIaADwFAENAJ4ioAHAUwQ0AHiKgAYATxHQAOApAhoAPEVAA4CnCGgA8BQBDQCeIqABwFMENAB4ioAGAE8R0ADgKQIaADxFQAOAp/4fTevOAylpgQ4AAAAASUVORK5CYII=';

function Donation(props) {
    const [targetToken, setTargetToken] = useState('stt');
    const [value, setValue] = useState(0.0);
    const [inputWidth, setInputWidth] = useState(3);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0.0);
    const [toastText, setToastText] = useState('');
    const [toastErrorShow, setToastErrorShow] = useState(false);
    const [toastCompleteShow, setToastCompleteShow] = useState(false);
    const [showWwModal, setWwModal] = useState(false);

    const from_options = [
        { value: 'stt', label: 'STT', icon: '/img/stt-logo.svg' },
        { value: 'usdt', label: 'USDT', icon: '/img/tether.svg' },
    ];
    const from_list = ['stt', 'usdt'];
    const to_options = [
        { value: 'stt', label: 'STT', icon: '/img/stt-logo.svg' },
        { value: 'usdt', label: 'USDT', icon: '/img/tether.svg' },
        { value: 'usdc', label: 'USDC', icon: '/img/usdc.svg' },
        { value: 'weth', label: 'WETH', icon: '/img/weth.webp' },
        { value: 'arb', label: 'ARB', icon: '/img/arb.svg' },
        { value: 'wbtc', label: 'WBTC', icon: '/img/wbtc.svg' },
        { value: 'link', label: 'LINK', icon: '/img/link.svg' },
        { value: 'dai', label: 'DAI', icon: '/img/dai.svg' },
    ];
    const to_list = ['stt', 'usdt', 'usdc', 'weth', 'arb', 'wbtc', 'link', 'dai'];
    const { Option, SingleValue, IndicatorsContainer } = components;
    const IconOption = (props) => (
        <Option {...props}>
            <span style={{ position: 'relative' }}>
                <img style={{ width: 28, padding: 4 }} src={props.data.icon} alt='' />
                <span className={'token-chip'}>
                    <img src={arb_icon} alt={''} />
                </span>
            </span>
            <span style={{ display: 'block', marginLeft: 10 }}>{props.data.label}</span>
        </Option>
    );

    const ValueOption = (props) => (
        <SingleValue {...props}>
            {' '}
            <span style={{ position: 'relative' }}>
                <img style={{ width: 28, padding: 2 }} src={props.data.icon} alt='' />
                <span className={'token-chip'}>
                    <img src={arb_icon} alt={''} />
                </span>
            </span>{' '}
            <span>{props.data.label}</span>
            <span style={{ display: 'block', width: 1 }}></span>{' '}
        </SingleValue>
    );

    const CustomIndicator = (props) => (
        <IndicatorsContainer {...props}>
            <i className='fa-solid fa-caret-down'></i>
        </IndicatorsContainer>
    );

    function changeTargetToken(dir) {
        setTargetToken(dir.value);
        setValue(0);
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(tokenList[dir.value].contract, tokenList[dir.value].abi, provider);
            contract.balanceOf(props.account).then((res) => {
                const balance: any = parseInt(String(Number(res) / Math.pow(10, tokenList[dir.value].decimals)));
                setMaxValue(balance);
            });
        } else {
            setMaxValue(0);
        }
    }

    async function makeDonation() {
        const token = tokenList[targetToken];
        console.log(token);
        if (window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(token.contract, token.abi, signer);
            const connectedContract: any = await contract.connect(signer);
            const sendValue = value * Math.pow(10, token.decimals);
            if (value > maxValue) {
                setToastText('Requested amount exceeds your balance');
                setToastErrorShow(true);
            }
            console.log(contract);
            console.log(sendValue);
            await connectedContract
                .transfer(token.target, sendValue.toString())
                .then((res) => {
                    setToastCompleteShow(true);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    function handleChange(e) {
        setValue(e.target.value);
        setInputWidth(e.target.value.length + 1);
    }

    useEffect(() => {
        changeTargetToken({ value: 'stt' });
    }, []);

    return (
        <React.Fragment>
            <div className={'main-block eth-card'}>
                <div className={'main-block__header'}>DONATION</div>
                <div className={'donation__block'}>
                    <Form.Group
                        className='mb-2'
                        controlId='formBasicStt'
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}
                    >
                        <Form.Control
                            type='number'
                            placeholder='0.0'
                            className={'stt-input w-80'}
                            required
                            min={0.0}
                            onChange={(e) => handleChange(e)}
                            value={value !== 0 ? value : ''}
                            style={{ width: inputWidth + 'ch', backgroundColor: 'transparent', padding: 0 }}
                            disabled={props.withoutWallet || maxValue <= 0}
                        />
                        {maxValue > 0 ? (
                            <span className={'minimal-helper'}>
                                {!props.withoutWallet ? minValue : ''} - {maxValue}
                            </span>
                        ) : (
                            ''
                        )}
                    </Form.Group>
                    <Select
                        defaultValue={to_options[0]}
                        options={to_options}
                        components={{ Option: IconOption, SingleValue: ValueOption, IndicatorsContainer: CustomIndicator }}
                        className='react-select-container donation-select'
                        classNamePrefix='react-select'
                        onChange={changeTargetToken}
                        value={to_options[to_list.indexOf(targetToken)]}
                        isSearchable={false}
                        isDisabled={props.withoutWallet}
                    />
                </div>
                <div className={'donation__confirm'}>
                    {maxValue > 0 ? (
                        <div className={'donation__confirm-button'} onClick={makeDonation}>
                            <i className='fa-solid fa-check'></i>
                        </div>
                    ) : (
                        <div
                            className={'donation__confirm-button _disabled'}
                            onClick={props.withoutWallet ? () => setWwModal(true) : undefined}
                        >
                            <i className='fa-solid fa-check'></i>
                        </div>
                    )}
                </div>
            </div>
            <Toast
                onClose={() => setToastCompleteShow(false)}
                show={toastCompleteShow}
                onClick={() => setToastCompleteShow(false)}
                autohide
                delay={5000}
                className={'complete-toast'}
            >
                <Toast.Body>
                    <i className='fa-solid fa-circle-check' style={{ fontSize: '6rem', margin: 20, color: '#96fac5' }}></i>
                    <p style={{ fontWeight: 600 }}>SUCCESS</p>
                    <p className={'complete-toast-text'}>Please, refresh the page</p>
                </Toast.Body>
            </Toast>
            <Toast
                onClose={() => setToastErrorShow(false)}
                show={toastErrorShow}
                onClick={() => setToastErrorShow(false)}
                autohide
                delay={5000}
                className={'complete-toast'}
            >
                <Toast.Body>
                    <i className='fa-solid fa-circle-xmark' style={{ fontSize: '6rem', margin: 20, color: '#ff968f' }}></i>
                    <p className={'toast-err'} style={{ fontWeight: 600, color: '#dc3545' }}>
                        ERROR
                    </p>
                    <p className={'complete-toast-text'}>{toastText}</p>
                </Toast.Body>
            </Toast>
            <Modal
                size='sm'
                show={showWwModal}
                onHide={() => setWwModal(false)}
                aria-labelledby='info-mod-title'
                className={'pre-form-modal telegram-modal'}
                centered
            >
                <Modal.Body>
                    <div className={'stt_modal_header'}></div>
                    <div className={'help-wrapper telegram-wrapper'} style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <img src={'/img/lock.png'} alt={''} style={{ width: 80, marginTop: 70 }} />
                        <p style={{ fontSize: '1.1rem', marginBottom: 20, marginTop: 30, color: '#888888' }}>Authorization</p>
                        <p style={{ fontSize: '.8rem', marginTop: 0, fontWeight: 400, marginBottom: 25 }}>
                            To use full functionality, login to the
                            <br />
                            website with the browser of your crypto
                            <br />
                            wallet
                        </p>
                        <a
                            href={'/loginThunk.pdf'}
                            target={'_blank'}
                            rel={'noreferrer'}
                            style={{
                                fontSize: '.8rem',
                                marginTop: 0,
                                fontWeight: 500,
                                display: 'block',
                                marginBottom: 45,
                                color: '#47c999',
                            }}
                        >
                            Instructions
                        </a>
                        <Button className='modal-button' onClick={() => setWwModal(false)}>
                            Ok
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
}

export default Donation;
