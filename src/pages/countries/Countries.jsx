import React, { useState, createRef } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { StyledThumbnailPreview, StyledBlueButton, StyledRedButton } from '../../StyledComponents';
import { countries } from '../../utility/countries-iso';
import { useEffect } from 'react';
import { deleteCountryThumbnail, getCountryThumbnails, updateCountryThumbnail, uploadCountryThumbnail } from '../../utility/api';
import Loader from '../../components/Loader/Loader';

const Countries = ({ winSize }) => {
    const [country, setCountry] = useState('');
    const [countryThumbnails, setCountryThumbnails] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const getInitialData = async () => {
        await getCountryThumbnails(setCountryThumbnails, setIsLoading);
    }

    useEffect(() => {
        getInitialData()
    }, [])

    const handleCountry = (e, { value }) => {
        e.preventDefault();
        setCountry(value);
    };

    const handleFileChange = async e => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('country', country);
        formData.append('image', file);
        //check if country already has image
        const existingCountry = countryThumbnails.find(c => c.country === country);
        if (!!existingCountry) {
            await updateCountryThumbnail(existingCountry.id, formData, setIsLoading)
            await getCountryThumbnails(setCountryThumbnails, setIsLoading);
            return;
        }
        await uploadCountryThumbnail(formData, setIsLoading)
        await getCountryThumbnails(setCountryThumbnails, setIsLoading);
    };

    const fileInputRef = createRef();

    const handleFileDelete = async (id) => {
        await deleteCountryThumbnail(id,setIsLoading)
        await getCountryThumbnails(setCountryThumbnails,setIsLoading)
    }

    return (
        <div style={{ maxWidth: 500, margin: 'auto' }}>
            {isLoading && <div style={{ position: 'fixed',zIndex:5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}
            <h1>Countries</h1>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Country</label>
                <Dropdown
                    clearable
                    placeholder='Select Country'
                    fluid
                    search
                    selection
                    options={countries}
                    onChange={handleCountry}
                    value={country}
                />
            </div>
            <div style={{ marginTop: 20 }}>
                <StyledThumbnailPreview
                    file={(countryThumbnails.find(c => c.country === country) || {}).image}
                // file={file instanceof File ? URL.createObjectURL(file) : file} 
                />
            </div>
            <div style={{ marginTop: 20 }}>
                <StyledBlueButton onClick={() => fileInputRef.current.click()} icon="image"
                >
                    Upload Thumbnail
                </StyledBlueButton>
                <StyledRedButton onClick={() => handleFileDelete((countryThumbnails.find(c => c.country === country) || {}).id)}
                >
                    <i className="trash icon"></i>
                </StyledRedButton>
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleFileChange}
                />
            </div>

        </div >
    )
}

export default Countries
