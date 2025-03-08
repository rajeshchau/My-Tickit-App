import * as React from 'react';
import { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api'; // Corrected import statement
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function AddressForm() {
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    saveAddress: boolean;
  }>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    saveAddress: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const saveAddressMutation = useMutation(api.mutations.saveAddress);
  
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address1) newErrors.address1 = 'Address line 1 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zip) newErrors.zip = 'Zip code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      const response = await saveAddressMutation(formData); // Include saveAddress
      if (response) {
        console.log('Address saved successfully:', response);
        setSubmitError(null); // Clear any previous error
      } else {
        setSubmitError('Failed to save address. Please try again.'); // Set error message
      }
      console.log('Form submitted:', formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {submitError && <Alert severity="error">{submitError}</Alert>} {/* Display error alert */}
      <Grid container spacing={3}>
        <FormGrid item xs={12} md={6}>
          <FormLabel htmlFor="first-name" required>
            First name
          </FormLabel>
          <OutlinedInput
            value={formData.firstName}
            onChange={handleChange}
            id="first-name"
            name="firstName"
            type="text"
            placeholder="John"
            autoComplete="first name"
            required
            size="small"
          />
          {errors.firstName && <span style={{ color: 'red' }}>{errors.firstName}</span>} {/* Error message */}
        </FormGrid>
        <FormGrid item xs={12} md={6}>
          <FormLabel htmlFor="last-name" required>
            Last name
          </FormLabel>
          <OutlinedInput
            value={formData.lastName}
            onChange={handleChange}
            id="last-name"
            name="lastName"
            type="text"
            placeholder="Snow"
            autoComplete="last name"
            required
            size="small"
          />
          {errors.lastName && <span style={{ color: 'red' }}>{errors.lastName}</span>} {/* Error message */}
        </FormGrid>
        <FormGrid item xs={12}>
          <FormLabel htmlFor="address1" required>
            Address line 1
          </FormLabel>
          <OutlinedInput
            value={formData.address1}
            onChange={handleChange}
            id="address1"
            name="address1"
            type="text"
            placeholder="Street name and number"
            autoComplete="shipping address-line1"
            required
            size="small"
          />
          {errors.address1 && <span style={{ color: 'red' }}>{errors.address1}</span>} {/* Error message */}
        </FormGrid>
        <FormGrid item xs={12}>
          <FormLabel htmlFor="address2">Address line 2</FormLabel>
          <OutlinedInput
            value={formData.address2}
            onChange={handleChange}
            id="address2"
            name="address2"
            type="text"
            placeholder="Apartment, suite, unit, etc. (optional)"
            autoComplete="shipping address-line2"
            size="small"
          />
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="city" required>
            City
          </FormLabel>
          <OutlinedInput
            value={formData.city}
            onChange={handleChange}
            id="city"
            name="city"
            type="text"
            placeholder="New York"
            autoComplete="City"
            required
            size="small"
          />
          {errors.city && <span style={{ color: 'red' }}>{errors.city}</span>} {/* Error message */}
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="state" required>
            State
          </FormLabel>
          <OutlinedInput
            value={formData.state}
            onChange={handleChange}
            id="state"
            name="state"
            type="text"
            placeholder="NY"
            autoComplete="State"
            required
            size="small"
          />
          {errors.state && <span style={{ color: 'red' }}>{errors.state}</span>} {/* Error message */}
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="zip" required>
            Zip / Postal code
          </FormLabel>
          <OutlinedInput
            value={formData.zip}
            onChange={handleChange}
            id="zip"
            name="zip"
            type="text"
            placeholder="12345"
            autoComplete="shipping postal-code"
            required
            size="small"
          />
          {errors.zip && <span style={{ color: 'red' }}>{errors.zip}</span>} {/* Error message */}
        </FormGrid>
        <FormGrid item xs={6}>
          <FormLabel htmlFor="country" required>
            Country
          </FormLabel>
          <OutlinedInput
            value={formData.country}
            onChange={handleChange}
            id="country"
            name="country"
            type="text"
            placeholder="United States"
            autoComplete="shipping country"
            required
            size="small"
          />
          {errors.country && <span style={{ color: 'red' }}>{errors.country}</span>} {/* Error message */}
        </FormGrid>
        <FormGrid item xs={12}>
          <FormControlLabel
            control={<Checkbox name="saveAddress" value="yes" checked={formData.saveAddress} onChange={handleChange} />}
            label="Use this address for payment details"
          />
        </FormGrid>
      </Grid>
    <Button type="submit" variant="contained" color="primary"> {/* Added submit button */}
      Submit
    </Button>
</form>
  );
}
