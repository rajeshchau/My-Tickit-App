"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import AddressForm from "../components/AddressForm";
import Info from "../components/Info";
import InfoMobile from "../components/InfoMobile";
import PaymentForm from "../components/PaymentForm";
import SitemarkIcon from "../components/SitemarkIcon";
import AppTheme from "../shared-theme/AppTheme";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";

import { getConvexClient } from "@/lib/convex";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";

const steps = ["Shipping address", "Payment details"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    default:
      throw new Error("Unknown step");
  }
}

export default function Checkout() {
  // Get the router and params using Next.js client hooks
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // id from the URL

  // Local state for the active step in the checkout process
  const [activeStep, setActiveStep] = React.useState(0);

  // Get the Convex client and hooks for user, query, and mutation
  const convex = getConvexClient();
  const user = useUser();

  // Query for event details using the id from the URL.
  const event = useQuery(api.events.getById, {
    eventId: id as Id<"events">,
  });

  // Set up a mutation for purchasing a ticket.
  const purchaseTicket = useMutation(api.events.purchaseTicket);

  const handlePurchaseTicket = async () => {
    try {
      // Query for the waiting list queue position
      const position = await convex.query(api.waitingList.getQueuePosition, {
        eventId: id as Id<"events">,
        userId: user.user?.id || "",
      });
      if (!position) {
        console.error("Queue position not found.");
        return;
      }
      // Purchase the ticket using the mutation
      await purchaseTicket({
        userId: user.user?.id || "",
        eventId: id as Id<"events">,
        waitingListId: position._id as Id<"waitingList">,
        paymentInfo: {
          paymentIntentId: "", // Replace with actual payment intent id from Stripe
          amount: event?.price || 0,
        },
      });
      router.push(`/tickets/${id}`);
    } catch (error) {
      console.error("Error purchasing ticket:", error);
    }
  };

  const totalPrice = event ? `$${event.price.toFixed(2)}` : "$0.00";

  const handleNext = () => {
    if (activeStep === steps.length) {
      router.push(`/tickets/${id}`);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ position: "fixed", top: "1rem", right: "1rem" }}>
        <ColorModeIconDropdown />
      </Box>

      <Grid
        container
        sx={{
          height: {
            xs: "100%",
            sm: "calc(100dvh - var(--template-frame-height, 0px))",
          },
          mt: { xs: 4, sm: 0 },
        }}
      >
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            backgroundColor: "background.paper",
            borderRight: { sm: "none", md: "1px solid" },
            borderColor: { sm: "none", md: "divider" },
            alignItems: "start",
            pt: 16,
            px: 10,
            gap: 4,
          }}
        >
          <SitemarkIcon />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: 500,
            }}
          >
            <Info totalPrice={totalPrice} />
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={7}
          lg={8}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "100%",
            width: "100%",
            backgroundColor: { xs: "transparent", sm: "background.default" },
            alignItems: "start",
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { sm: "space-between", md: "flex-end" },
              alignItems: "center",
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
            }}
          >
            <Stepper
              id="desktop-stepper"
              activeStep={activeStep}
              sx={{ width: "100%", height: 40 }}
            >
              {steps.map((label) => (
                <Step
                  key={label}
                  sx={{
                    ":first-of-type": { pl: 0 },
                    ":last-of-type": { pr: 0 },
                  }}
                >
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Card sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
            <CardContent
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">
                  {activeStep >= 2 ? "$144.97" : "$134.98"}
                </Typography>
              </div>
              <InfoMobile totalPrice={activeStep >= 2 ? "$144.97" : "$134.98"} />
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              maxWidth: { sm: "100%", md: 600 },
              maxHeight: "720px",
              gap: { xs: 5, md: "none" },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: "flex", md: "none" } }}
            >
              {steps.map((label) => (
                <Step
                  key={label}
                  sx={{
                    ":first-of-type": { pl: 0 },
                    ":last-of-type": { pr: 0 },
                  }}
                >
                  <StepLabel
                    sx={{
                      ".MuiStepLabel-labelContainer": { maxWidth: "70px" },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  Your order number is <strong>#140396</strong>. We have emailed your
                  order confirmation and will update you once it&apos;s shipped.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    alignSelf: "start",
                    width: { xs: "100%", sm: "auto" },
                  }}
                  onClick={handlePurchaseTicket}
                >
                  Go to my orders
                </Button>
              </Stack>
            ) : (
              <>
                {getStepContent(activeStep)}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      activeStep !== 0 ? "space-between" : "flex-end",
                  }}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1
                      ? "Place order"
                      : "Next"}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </AppTheme>
  );
}
