import React, { Component, useRef, useState, useEffect } from 'react'

import './DonationForm.scss';

const DonationProgressBar = ({amountToFund, amountFunded}) => {

    const amountFundedText = () => {
        let remainingToFund = amountToFund - amountFunded;
        if (remainingToFund < 1) {
            return (<span>We did it! We have now raised <strong>${amountFunded}</strong> for this project</span>)
        }
        return (<span><strong>${remainingToFund}</strong> still needed to find this project</span>)
    }

    return (
        <div className="progress-bar">
            <div className="progress-bar__tooltip">
               {amountFundedText()}
            </div>
            <span 
                className="progress-bar__progression progress-bar__progression--filled"
                style={{ width: (amountFunded/amountToFund) * 100 + '%'}}
                tabIndex="-1">
            </span>
            <span
                className="progress-bar__progression progress-bar__progression--togo"
                style={{ width: 100 - (amountFunded/amountToFund) * 100 + '%'}}
                tabIndex="-1">
            </span>
        </div>
    )
}

const InputWithButton = ({name, type, buttonText, onSubmit, validateFn}) => {

    const [notification, setNotification] = useState({ active: false });
    const [submitState, setSubmitState] = useState(false);

    const inputField = useRef(null);

    const submitStateTransition = () => {
        setSubmitState(!submitState);

        setTimeout(() => {
            setSubmitState(submitState)
        }, 2000);
    }

    const onHanldeSubmit = () => {
        
        let value = inputField.current.value;

        if(type === 'currency') {
            value = parseFloat(parseFloat(inputField.current.value).toFixed(2));
        }

        if(validateFn && !validateFn(value, setNotification)){
            inputField.current.select();
            return false;
        }

        setNotification({ active: false });
       
        submitStateTransition();
        onSubmit(value);

        inputField.current.value = "";
    }

    const formInputProps = {
        className: (notification.active) ? "form-input form-input--btn-combo" : `form-input form-input--btn-combo form-input--${notification.type}`
    }

    const inputLabelProps = {
        htmlFor: name,
        className: `form-input__label form-input__label--${type}`
    }

    const inputProps = {
        name,
        className: `form-input__input form-input__input--${type}`,
        ref: inputField,
        type: "number",
        onKeyDown: (e) => {
            if(e.key === 'Enter') {
                onHanldeSubmit();
            }
        }
    }

    const btnProps = {
        className: (submitState) ? "form-input__button form-input__button--success" : "form-input__button",
        onClick: () => {
            onHanldeSubmit();
        }
    }

    const inputNotification = () => {
        if(notification.active && notification.type !== 'success') {
            return (
                <div className={`form-input__notification form-input__notification--${notification.type}`}>
                    {notification.message}
                </div>
            );
        }
        return null;
    }

    return(
        <div { ...formInputProps }>
            <label { ...inputLabelProps }>
                <input { ...inputProps} />
                <button {...btnProps }> 
                    { submitState ? '\u2714' : buttonText } 
                </button>
            </label>
            { inputNotification() }
        </div>
    )
}

export class DonationForm extends Component {

    constructor(props) {
        super(props);

        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.validateDonationInput = this.validateDonationInput.bind(this);

        this.state = {
            amountFunded: props.amountFunded,
            totalDonations: props.totalDonations
        };
    }

    addDonation(amount){
        this.setState({
            amountFunded: this.state.amountFunded + amount,
            totalDonations: this.state.totalDonations + 1
        })
    }

    handleOnSubmit(value) {
        this.addDonation(value);
    }

    isCampaignActive() {
        return !!(this.props.endDate.getTime() - Date.now());
    }

    totalDonationsParagraph() {
        return ( <p>Join the <strong>{this.state.totalDonations}</strong> other donors who have already supported this projects </p>)
    };
    
    remainingCampaignTimeHeading() {

        let remainingTimeText = "";

        if (!this.isCampaignActive()){
            remainingTimeText = `Sorry donations are now closed.`;
        }

        let timeLeft = this.props.endDate.getTime() - Date.now();
        timeLeft = timeLeft / 1000 / 60;
        
        if(timeLeft < 59){
            timeLeft = Math.ceil(timeLeft);
            remainingTimeText =  `Only ${timeLeft} minutes left to fund this project`;
        }

        timeLeft = timeLeft / 60;
        timeLeft = Math.ceil(timeLeft);

        if(timeLeft > 24) {
            timeLeft = timeLeft / 24;
            timeLeft = Math.ceil(timeLeft);
            remainingTimeText =  `Only ${timeLeft} Days left to fund this project`;
        } else {
            remainingTimeText =  `Only ${timeLeft} hours left to fund this project`;
        }

        return (<h2>{remainingTimeText}</h2>);
    }

    validateDonationInput(value, setInputNotification) {
        if (value && !isNaN(value) && value > this.props.donationMinRequired) {
            return true;
        }

        setInputNotification({ 
            active: true,
            type: 'error',
            message: `Minimum of $${this.props.donationMinRequired} required` 
        });
        return false;
    }
    
    render() {

        const inputWithButtonProps = {
            name: 'donationInput',
            type: 'currency',
            buttonText: 'Give Now',
            onSubmit: this.handleOnSubmit,
            validateFn: this.validateDonationInput
        };

        const donationProgressBarProps = {
            amountToFund: this.props.amountToFund, 
            amountFunded: this.state.amountFunded 
        };



        return (
            <div className="donation-form">
                <DonationProgressBar { ...donationProgressBarProps } />
                <div className="donation-form__content">
                    { this.remainingCampaignTimeHeading() }
                    { this.totalDonationsParagraph() }
                    <InputWithButton { ...inputWithButtonProps }/>
                </div>
            </div>
        )
    }   
}

DonationForm.defaultProps = {
    amountToFund : 0,
    amountFunded: 0,
    donationMinRequired: 0,
    totalDonations: 0,
    endDate: Date.now()
}

export default DonationForm;