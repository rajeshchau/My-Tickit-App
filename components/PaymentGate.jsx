import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, CreditCard, Calendar, User, Lock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PaymentForm = ({ amount = 0, currency = 'USD' }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError('');
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || '';
      setFormData(prev => ({
        ...prev,
        [name]: formatted.slice(0, 19)
      }));
      return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '');
      const month = formatted.slice(0, 2);
      const year = formatted.slice(2, 4);
      
      if (formatted.length >= 2) {
        if (parseInt(month) > 12) {
          setFormData(prev => ({
            ...prev,
            [name]: '12/' + year
          }));
          return;
        }
        setFormData(prev => ({
          ...prev,
          [name]: month + (formatted.length > 2 ? '/' + year : '')
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: formatted
        }));
      }
      return;
    }

    // Format CVV
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: formatted.slice(0, 3)
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber.match(/^\d{16}$/)) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    const [month, year] = formData.expiryDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
      setError('Card has expired');
      return false;
    }
    
    if (!formData.cvv.match(/^\d{3}$/)) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    
    if (formData.name.trim().length < 3) {
      setError('Please enter the cardholder name');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: ''
      });
    } catch {
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Tickiter Payment</CardTitle>
            <CardDescription className="text-blue-100">Secure Payment Processing</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{amount.toFixed(2)} {currency}</div>
            <div className="text-sm text-blue-100">Total Amount</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Card Number
            </Label>
            <Input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('cardNumber')}
              onBlur={() => setFocusedField(null)}
              className={`w-full ${focusedField === 'cardNumber' ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expiry Date
              </Label>
              <Input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('expiryDate')}
                onBlur={() => setFocusedField(null)}
                className={focusedField === 'expiryDate' ? 'border-blue-500 ring-2 ring-blue-200' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                CVV
              </Label>
              <Input
                type="text"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('cvv')}
                onBlur={() => setFocusedField(null)}
                className={focusedField === 'cvv' ? 'border-blue-500 ring-2 ring-blue-200' : ''}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Cardholder Name
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className={`w-full ${focusedField === 'name' ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {error && (
          <Alert variant="destructive" className="animate-shake">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Payment Successful</AlertTitle>
            <AlertDescription>Thank you for your payment!</AlertDescription>
          </Alert>
        )}
        <Button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay ${amount.toFixed(2)} ${currency}`
          )}
        </Button>
        <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          Secured by Tickiter Payment Systems
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;