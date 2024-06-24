import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const ActionButton = () => {
    const {
        trigger,
        formState: { errors, isSubmitting },
    } = useFormContext<{ address: string }>();

    useEffect(() => {
        trigger();
    }, [trigger]);

    return (
        <Button type="submit" disabled={!!errors.address?.message || isSubmitting} variant="contained">
            {errors.address?.message
                ? errors.address?.message
                : isSubmitting
                    ? "Please wait..."
                    : "Request ETH Sepolia"}
        </Button>
    );
};

export default ActionButton;