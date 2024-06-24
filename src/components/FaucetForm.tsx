'use client';

import React, { Fragment } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import axios from "axios";
import { toast } from "react-toastify";

import ActionButton from "./ActionButton";
import AddressInput from "./AddressInput";

const FaucetForm = () => {
    const methods = useForm<{
        address: string;
    }>({
        mode: "onChange",
        delayError: 200,
    });

    const onSubmit: SubmitHandler<{ address: string }> = async (data: any) => {
        try {
            const drip = await axios.post("api", {
                address: data.address.toLowerCase(),
            });
            toast.success(`Success! ${drip.data?.message ?? ""}`);
        } catch (err) {
            toast.error(
                // @ts-ignore
                err.message
                    ? // @ts-ignore
                    `${err.message} - ${err.response?.data?.error ?? ""}`
                    : "Something went wrong"
            );
        }
    };

    return (
        <Fragment>
            <FormProvider {...methods}>
                <Box
                    component="form"
                    onSubmit={methods.handleSubmit(onSubmit)}
                    sx={(theme) => ({
                        width: "100%",
                        borderRadius: "1rem",
                        border: `1px solid ${theme.palette.grey[700]}`,
                        padding: "1.4375rem 2rem 2rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2.5625rem",
                    })}>
                    <AddressInput />
                    <ActionButton />
                </Box>
            </FormProvider>
        </Fragment>
    );
};

export default FaucetForm;
