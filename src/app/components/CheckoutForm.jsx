import React, { useState, useEffect } from 'react'
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import api from '../../utils/fetchData'
import Button from './Button'
import Loader from "./Loader"
import { CheckCircle, ChevronRight, CreditCard, X } from 'react-feather'
import Link from 'next/link'
import { countryNames } from '@/utils/dummydata'
import { useCart } from '../context/CartContext'

export default function CheckoutForm({onCancel,onSuccess}) {
    const { state: cartState, dispatch: cartDispatch } = useCart();

  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [clientSecret, setClientSecret] = useState('')
  const [orderDetails, setOrderDetails] = useState({})
  const stripe = useStripe()
  const elements = useElements()
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState(0);
  const [country, setCountry] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    (async () => {
      const resp = await api.proceedCheckout(cartState?.products)
      console.log(resp)
      if (!resp.message) {
        setClientSecret(resp.clientSecret)
        setOrderDetails(resp.finalOrder)
      }
    })()
  }, [])

  const cardStyle = {
    style: {
      base: {
        fontSmoothing: "antialiased",
        fontSize: "16px",
        color: "#27272a",
        "::placeholder": {
          color: "gray"
        },
        "::-ms-clear": {
          border: "2px solid gray"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  }
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty)
    setError(event.error ? event.error.message : "")
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    })
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false)
    } else {
      setError(null)
      setProcessing(false)
      setSucceeded(true)
      onSuccess()
    }
  }

  if (succeeded) {
    return (
      <div className='flex flex-col items-center'>
        <CheckCircle className='w-20 h-20 text-green-400' />
        <p className='text-lg font-light my-4'>Order Placed Successfully</p>
        
				<Button secondary onClick={onCancel}>Close</Button>
      </div>
    )
  }

  return (
    <div>
      <section className="mb-6 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            className="mt-1 p-2 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ZipCode
          </label>
          <input
            type="number"
            className="mt-1 p-2 text-black block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 p-2 block text-black w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="" disabled>
              Select a country
            </option>
            {countryNames.map((country) => (
              <option value={country}>{country}</option>
            ))}
          </select>
        </div>
        {orderDetails?.amount && (
          <div className="flex justify-between text-lg mt-2">
            <h4 className="text-lg mb-2">Final Order</h4>
            <span className="font-bold text-xl">${orderDetails.amount}</span>
          </div>
        )}
        {orderDetails?.products?.length ? (
          <ul>
            {orderDetails?.products?.map((product) => (
              <CheckoutItem
                key={product._id}
                title={product.name}
                price={product.price}
                quantity={product.quantity}
                image={product?.images[0]}
              />
            ))}
          </ul>
        ) : (
          <Loader color="bg-gray-600" />
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <CardElement options={cardStyle} onChange={handleChange} />
        {/* Show any error that happens when processing the payment */}
        {error && (
          <div className="text-red-400 mt-2" role="alert">
            {error}
          </div>
        )}
        <Button
          className="w-full mt-6"
          disabled={processing || disabled || succeeded || zipCode==0 || address=='' || country=='' }>
          {processing ? (
            <Loader />
          ) : (
            <>
              <CreditCard className="mr-2 opacity-70" />
              <span>Make Payment</span>
            </>
          )}
        </Button>
        <Button className="w-full" secondary onClick={onCancel}>
          Cancel
        </Button>
      </form>
    </div>
  );
}

function CheckoutItem({title, price, quantity,image}) {
  return (
    <li className="flex justify-between items-center">
      <div className=' flex gap-4 items-center'>
        <img className="h-6" src={image} />

        <p>{title}</p>
      </div>
      <div className="flex justify-between items-center">
        {quantity > 1 && (
          <span className="inline-flex items-center text-gray-400 mr-5">
            <X className="" />
            {quantity}
          </span>
        )}
        <span className="text-lg font-light">${quantity * price}</span>
      </div>
    </li>
  );
}