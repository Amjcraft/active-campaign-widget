import React from 'react';
import { hot } from 'react-hot-loader/root'

import DonationForm from './Components/DonationForm/index';
import './styles/app.scss';


function App() {
  
  const donationFormProps = {
    amountToFund : 4000,
    donationMinRequired: 5,
    endDate: new Date('10/7/2020 13:00')    
  }

  return (
    <div className="app-container">
      <DonationForm { ...donationFormProps }></DonationForm>
    </div>
  );
}

export default hot(App);
