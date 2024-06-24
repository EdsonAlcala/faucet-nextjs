import React from "react";
import { Controller } from "react-hook-form";
import { isAddress } from "viem";

import { TextField } from "@mui/material";

const AddressInput = () => {
    return (
        <Controller
            name="address"
            rules={{
                required: "Provide a wallet address.",
                validate: {
                    max: (value: string) => {
                        if (!isAddress(value)) {
                            return "Please provide a valid wallet address";
                        }
                    },
                },
            }}
            render={({ field: { onChange, value }, formState: { isSubmitting } }) => (
                <TextField disabled={isSubmitting} onChange={onChange} value={value} id="outlined-basic" label="Your wallet address" variant="outlined" placeholder="Your wallet address..." />
            )}
        />
    );
};

export default AddressInput;
