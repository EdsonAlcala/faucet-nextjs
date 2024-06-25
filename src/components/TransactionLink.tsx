import React from 'react';
import { Typography, Link } from '@mui/material';

type TransactionLinkProps = {
    transactionHash: string;
};

const TransactionLink = ({ transactionHash }: TransactionLinkProps) => {
    const getEtherScanUrl = (hash: string) => `https://sepolia.etherscan.io/tx/${hash}`;

    return (
        <Typography variant="body1">
            Success! View Transaction{' '}
            <Link href={getEtherScanUrl(transactionHash)} target="_blank" rel="noopener noreferrer">
                here
            </Link>
        </Typography>
    );
};

export default TransactionLink;
