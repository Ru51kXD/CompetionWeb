'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { FaCreditCard, FaCheck, FaSpinner } from 'react-icons/fa';

// В реальном приложении перенесите это в .env.local
const stripePromise = loadStripe('pk_test_example');

const PaymentForm = ({ amount, competitionName, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js еще не загружен
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Получаем данные карты
    const cardElement = elements.getElement(CardElement);
    
    try {
      // Создаем платежный метод
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // В реальном приложении здесь был бы запрос к вашему API
      // для создания платежа или подписки на сервере
      
      // Имитация запроса к API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Сохраняем результат
      setPaymentMethod(paymentMethod);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess({
          paymentMethodId: paymentMethod.id,
          amount,
          competitionName,
          date: new Date().toISOString()
        });
      }
      
      // Очищаем форму
      cardElement.clear();
      setBillingDetails({
        name: '',
        email: '',
        phone: '',
        address: {
          line1: '',
          city: '',
          state: '',
          postal_code: '',
          country: ''
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBillingDetailsChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaCheck className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-400">
                Оплата прошла успешно!
              </h3>
              <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                <p>
                  Вы успешно зарегистрировались на соревнование "{competitionName}".
                  Детали оплаты отправлены на вашу электронную почту.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Данные плательщика
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Полное имя
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={billingDetails.name}
                onChange={handleBillingDetailsChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={billingDetails.email}
                onChange={handleBillingDetailsChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={billingDetails.phone}
                onChange={handleBillingDetailsChange}
                className="input"
              />
            </div>
            
            <div>
              <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Страна
              </label>
              <input
                type="text"
                id="address.country"
                name="address.country"
                value={billingDetails.address.country}
                onChange={handleBillingDetailsChange}
                className="input"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="address.line1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Адрес
              </label>
              <input
                type="text"
                id="address.line1"
                name="address.line1"
                value={billingDetails.address.line1}
                onChange={handleBillingDetailsChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Город
              </label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={billingDetails.address.city}
                onChange={handleBillingDetailsChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Регион
              </label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={billingDetails.address.state}
                onChange={handleBillingDetailsChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label htmlFor="address.postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Почтовый индекс
              </label>
              <input
                type="text"
                id="address.postal_code"
                name="address.postal_code"
                value={billingDetails.address.postal_code}
                onChange={handleBillingDetailsChange}
                className="input"
                required
              />
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8">
            Данные платежной карты
          </h3>
          
          <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-800">
            <CardElement 
              className="py-3"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-8">
            <div className="text-lg font-bold">
              Сумма к оплате: {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount)}
            </div>
            
            <button
              type="submit"
              disabled={!stripe || loading}
              className="btn-primary flex items-center space-x-2 py-3 px-6"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Обработка...</span>
                </>
              ) : (
                <>
                  <FaCreditCard />
                  <span>Оплатить</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default function PaymentSystem({ competitionName, amount, onSuccess }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <FaCreditCard className="mr-2 text-primary-600" />
        Оплата регистрации
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Для участия в соревновании "{competitionName}" необходимо оплатить регистрационный взнос.
      </p>
      
      <Elements stripe={stripePromise}>
        <PaymentForm amount={amount} competitionName={competitionName} onSuccess={onSuccess} />
      </Elements>
      
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        <p className="mb-2">
          * Ваши платежные данные защищены и обрабатываются через Stripe.
        </p>
        <p>
          * В случае отмены регистрации возврат средств производится в соответствии с правилами соревнования.
        </p>
      </div>
    </div>
  );
} 