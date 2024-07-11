import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled component for 3D button
const StyledButton = styled(Button)`
  background: linear-gradient(145deg, #6b8dd6, #486db7);
  box-shadow: 5px 5px 15px #3e5796, -5px -5px 15px #a2b5f7;
  color: white;
  font-weight: bold;
  transition: transform 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(145deg, #486db7, #6b8dd6);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(1px);
  }
}`;

// Styled component for gradient background wrapper
const BackgroundWrapper = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to right, #3a6186, #89253e);
  z-index: -1; // Put behind all content
`;

// Styled component for content container
const ContentContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  position: relative; // Make sure it is above the background
`;

// Define the ImageCard component
const ImageCard = styled(Box)`
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  img {
    max-width: 100%;
    border-radius: 10px;
  }
`;

const ResultItem = styled(Typography)`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  margin: 8px;
`;

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResults([]); // Clear previous results when new image is uploaded
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator

    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("http://localhost:5000/classify", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResults(data.results); // Store results in state
    setLoading(false); // Hide loading indicator
  };

  return (
    <>
      <BackgroundWrapper />
      <ContentContainer maxWidth="sm">
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          Image Classification by MSR
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            type="file"
            onChange={handleImageChange}
            variant="outlined"
            sx={{ mb: 3, background: "white", borderRadius: "5px" }}
            inputProps={{ accept: "image/*" }} // Only accept images
          />
          <Box>
            <StyledButton type="submit" variant="contained" size="large">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Classify Image"
              )}
            </StyledButton>
          </Box>
        </form>

        <Box display="flex" justifyContent="center" flexWrap="wrap">
          {results.map((result, index) => (
            <ResultItem key={index} variant="h5" sx={{ mt: 0, color: "white" }}>
              {`Result ${index + 1}: ${result.label}`}
            </ResultItem>
          ))}
        </Box>

        {image && (
          <ImageCard>
            <img src={URL.createObjectURL(image)} alt="Uploaded" />
          </ImageCard>
        )}
      </ContentContainer>
    </>
  );
};

export default UploadImage;
