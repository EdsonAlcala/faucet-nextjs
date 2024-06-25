'use client';

import React, { Fragment } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import axios from "axios";
import { toast } from "react-toastify";

import ActionButton from "./ActionButton";
import AddressInput from "./AddressInput";
import TransactionLink from './TransactionLink';

import { FormValues } from "./types";

const FaucetForm = () => {
    const methods = useForm<FormValues>({
        mode: "onChange",
        delayError: 200,
        defaultValues: {
            address: "",
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const drip = await axios.post("api", {
                address: data.address.toLowerCase(),
            });

            toast.success(<TransactionLink transactionHash={drip.data.result} />);
            methods.reset({ address: "" });

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
