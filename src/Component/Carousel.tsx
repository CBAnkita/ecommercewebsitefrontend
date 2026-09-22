
import React, { useEffect, useState } from "react";
import {
  Box,
  MobileStepper,
  Button,
} from "@mui/material";

function Carousel(props: any) {
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState(props.images);

  // Automatically change image
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Box sx={{ width: "100%" }}>

      {/* Image */}
      <Box
        component="img"
        src={images[activeStep]}
        alt={`Slide ${activeStep + 1}`}
        sx={{
          width: "100%",
          height: {
            xs: 220,
            sm: 300,
            md: 400,
          },
          objectFit: 'contain',
          display: "block",
        }}
      />

      {/* Dots */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          mt: 1,
        }}
      >
        {images.map((_: string, index: number) => (
          <Button
            key={index}
            onClick={() => setActiveStep(index)}
            sx={{
              minWidth: 10,
              width: 10,
              height: 10,
              padding: 0,
              borderRadius: "50%",
              backgroundColor:
                activeStep === index ? "primary.main" : "grey.400",
              "&:hover": {
                backgroundColor:
                  activeStep === index ? "primary.dark" : "grey.500",
              },
            }}
          />
        ))}
      </Box>

    </Box>
  );
}

export default Carousel;
