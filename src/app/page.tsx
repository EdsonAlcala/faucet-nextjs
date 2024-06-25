import { Box, Typography } from "@mui/material";

import FaucetForm from "../components/FaucetForm";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <main>
      <Box
        sx={{
          width: "50%",
          minWidth: "32rem",
          maxWidth: "35rem",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: "1.5rem",
          margin: "2rem auto",
        }}
      >
        <Typography
          sx={{
            fontSize: "2.5rem",
          }}>
          Sepolia Faucet with NEAR
        </Typography>

        <FaucetForm />

        <ToastContainer position="top-right" hideProgressBar limit={6} />

      </Box>
    </main>
  );
}
