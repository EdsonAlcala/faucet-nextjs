import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { isAddress } from "viem";

import { TextField } from "@mui/material";

const AddressInput = () => {
    const { control } = useFormContext();

    return (
        <Controller
            name="address"
            control={control}
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
            render={({ field, formState }) => (
                <TextField {...field} disabled={formState.isSubmitting} label="Your wallet address" variant="outlined" placeholder="Your wallet address..." />
            )}
        />
    );
};

export default AddressInput;
