import React, { useState, createRef, useEffect, Fragment } from "react";
import arrayMove from "array-move";
import {
    StyledBlueButton, StyledFormTextInput, StyledRedButton, StyledSubmitButton,
} from '../../StyledComponents';
import { Checkbox, Segment, Dropdown } from 'semantic-ui-react'
import { countries } from "../../utility/countries-iso";
import TagInput from "../../components/TagInput/TagInput";
import EXIF from "exif-js";
import { DateInput, } from 'semantic-ui-calendar-react';
import { processCategories } from "../../utility/helper-functions";
import { deletePhoto, getCategories, getPhotos, submitNewCategory, updateOrder, updatePhotoDetails, uploadPhoto } from "../../utility/api";
import SortableGallery from '../gallery/Gallery'
import Loader from "../../components/Loader/Loader";

function PhotoGallery() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(false);

    const [title, setTitle] = useState('');
    const [photographer, setPhotographer] = useState('');

    const [camera, setCamera] = useState('');
    const [lens, setLens] = useState('');
    const [focalLength, setFocalLength] = useState('');
    const [iso, setIso] = useState('');
    const [shutterSpeed, setShutterSpeed] = useState('');
    const [aperture, setAperture] = useState('');

    const [description, setDescription] = useState('');
    const [dateTaken, setDateTaken] = useState('');
    const [tags, setTags] = useState([]);
    const [country, setCountry] = useState('');

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [newCategory, setNewCategory] = useState([]);

    const fileInputRef = createRef();

    const onSortEnd = async ({ oldIndex, newIndex }) => {
        const reArrangedPhotos = arrayMove(items, oldIndex, newIndex);
        console.log('reArrangedPhotos', reArrangedPhotos)
        setItems(reArrangedPhotos);
        //update order
        updateOrder(reArrangedPhotos, 'photo_gallery_order')
    };

    const getInitialData = async () => {
        setIsLoading(true);
        const categoriesResponse = await getCategories() || {};

        const processedCategories = processCategories(categoriesResponse.data || []);
        setCategories(processedCategories);

        getPhotos(setItems, setIsLoading)
    }

    useEffect(() => {
        getInitialData()
    }, []);

    const handleDate = (event, { name, value }) => {
        setDateTaken(value);
    }

    const handleImageUpload = async e => {

        e.preventDefault()
        const file = e.target.files[0];
        const newPhotoFormData = new FormData();
        newPhotoFormData.append('image', file);
        EXIF.getData(file, async function () {
            const photoMetaData = this.exifdata;
            const isMetaDataEmpty = photoMetaData && Object.keys(photoMetaData).length === 0 && photoMetaData.constructor === Object;
            if (!isMetaDataEmpty) {
                const {
                    Make,
                    Model,
                    undefined: Lens,
                    FocalLength = {},
                    FNumber = {},
                    ExposureTime = {},
                    ISOSpeedRatings,
                    DateTime,
                } = this.exifdata
                newPhotoFormData.append('camera', Make + ' ' + Model);
                newPhotoFormData.append('lens', Lens);
                newPhotoFormData.append('focal_length', `${FocalLength.numerator / FocalLength.denominator}mm`);
                newPhotoFormData.append('aperture', 'f' + FNumber.numerator / FNumber.denominator);
                newPhotoFormData.append('shutter_speed', `${ExposureTime.numerator}/${ExposureTime.denominator}s`);
                newPhotoFormData.append('iso', ISOSpeedRatings);
                newPhotoFormData.append('date_taken', DateTime);

                const newArray = await uploadPhoto(newPhotoFormData, items, setIsLoading)

                setItems(newArray);
                updateOrder(newArray, 'photo_gallery_order')
                handleImageDetails(newArray[0])
            } else {
                const newArray = await uploadPhoto(newPhotoFormData, items, setIsLoading)
                setItems(newArray);
                updateOrder(newArray, 'photo_gallery_order')
                handleImageDetails(newArray[0])
            }

        });

    };

    const handleImageDetails = (photo) => {
        setCamera(photo.camera || '')
        setLens(photo.lens || '')
        setFocalLength(photo.focal_length || '')
        setShutterSpeed(photo.shutter_speed || '')
        setIso(photo.iso || '')
        setAperture(photo.aperture || '')

        setTitle(photo.title || '')
        setPhotographer(photo.photographer || '')
        setDescription(photo.description || '')
        setDateTaken(photo.date_taken || '')
        setTags(Array.isArray(JSON.parse(photo.tags ? photo.tags : '""')) ? JSON.parse(photo.tags) : [])
        setSelectedCategories((photo.categories || []).map(cat => cat.name));
        setCountry(photo.country)

        setSelectedPhoto(photo)
    }

    const submitImageDetails = async () => {
        const selectedCategoriesIds = categories.filter(cat => selectedCategories.includes(cat.text)).map(cat => cat._id);
        const formData = new FormData();
        formData.append('title', title || '');
        formData.append('photographer', photographer || '');
        formData.append('description', description || '');
        formData.append('camera', camera || '');
        formData.append('lens', lens || '');
        formData.append('focal_length', focalLength || '');
        formData.append('shutter_speed', shutterSpeed || '');
        formData.append('iso', iso || '');
        formData.append('aperture', aperture || '');
        formData.append('tags', JSON.stringify(tags));
        formData.append('country', country || '');
        formData.append('date_taken', dateTaken || '');
        formData.append('selected_categories', JSON.stringify(selectedCategoriesIds))

        updatePhotoDetails(selectedPhoto.id, formData, setIsLoading)
        setSelectedPhoto(null);
        getPhotos(setItems, setIsLoading)
    }

    const handleSelectedCategories = (e, { label, checked }) => {
        if (checked) {
            setSelectedCategories([...selectedCategories, label]);
        } else {
            setSelectedCategories(selectedCategories.filter(el => el !== label));
        }
    };

    const submitCategory = async () => {
        await submitNewCategory(newCategory, setIsLoading);
        const categoriesResponse = await getCategories();
        const processedCategories = processCategories(categoriesResponse.data);
        setCategories(processedCategories);
        setNewCategory('')
    }

    const handleDeleteImage = async (id) => {
        await deletePhoto(id, setIsLoading)

        // //update order 
        const newArray = items.filter(p => p.id !== id);
        updateOrder(newArray, 'photo_gallery_order')
        setItems(newArray);
    }
    return (
        <div>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1 style={{ textAlign: 'center' }}>Photo Gallery</h1>
            {selectedPhoto ?
                <div style={{ maxWidth: 500, margin: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <img style={{ maxWidth: 500, width: '100%' }} src={selectedPhoto.src} />
                    </div>
                    <div>
                        <label style={{ fontSize: '1.2em' }}>Title</label>
                        <StyledFormTextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Photographer</label>
                        <StyledFormTextInput value={photographer} onChange={(e) => setPhotographer(e.target.value)} placeholder='Photographer' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Description</label>
                        <StyledFormTextInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Date Taken</label>
                        <div
                        //  style={{ paddingLeft: 38 }}
                        >
                            <DateInput
                                name="date"
                                placeholder="Date Taken"
                                value={dateTaken}
                                iconPosition="left"
                                onChange={handleDate}
                                dateFormat="YYYY-MM-DD"
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Camera</label>
                        <StyledFormTextInput value={camera} onChange={(e) => setCamera(e.target.value)} placeholder='Camera' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Lens</label>
                        <StyledFormTextInput value={lens} onChange={(e) => setLens(e.target.value)} placeholder='Lens' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Focal Length</label>
                        <StyledFormTextInput value={focalLength} onChange={(e) => setFocalLength(e.target.value)} placeholder='Focal Length' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Shutter Speed</label>
                        <StyledFormTextInput value={shutterSpeed} onChange={(e) => setShutterSpeed(e.target.value)} placeholder='Shutter Speed' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Aperture</label>
                        <StyledFormTextInput value={aperture} onChange={(e) => setAperture(e.target.value)} placeholder='Aperture' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Iso</label>
                        <StyledFormTextInput value={iso} onChange={(e) => setIso(e.target.value)} placeholder='Iso' />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Tags</label>
                        <TagInput values={tags} onChange={(value) => setTags(value)} />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Create a new category</label>
                        <StyledFormTextInput value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder='New Category' />
                        <div style={{ marginTop: 10 }}>
                            <StyledBlueButton disabled={!newCategory} onClick={submitCategory} icon="image"
                            >
                                Create Category
                            </StyledBlueButton>
                        </div>
                    </div>
                    <Segment basic>
                        <p>Categories: {selectedCategories.length > 0 ? selectedCategories.join(", ") : "empty"}</p>

                        <Dropdown item simple text="Select categories">
                            <Dropdown.Menu>
                                {categories.map(cat => {

                                    return (
                                        <Dropdown.Item key={cat._id}>
                                            <Checkbox label={cat.text} checked={selectedCategories.includes(cat.text)} onChange={handleSelectedCategories} />
                                        </Dropdown.Item>
                                    )
                                })}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Segment>
                    <div style={{ marginTop: 20 }}>
                        <label style={{ fontSize: '1.2em' }}>Country</label>
                        <Dropdown
                            clearable
                            placeholder='Select Country'
                            fluid
                            search
                            selection
                            options={countries}
                            onChange={(e, { value }) => setCountry(value)}
                            value={country}
                        >

                        </Dropdown>
                    </div>
                    <div style={{ display: 'flex', marginTop: 20 }}>
                        <StyledSubmitButton onClick={() => submitImageDetails()} icon="image">
                            Update
                        </StyledSubmitButton>
                        <StyledRedButton style={{ maxWidth: 100, }} onClick={() => setSelectedPhoto(null)}
                        >
                            Cancel
                        </StyledRedButton>
                    </div>
                </div>
                : (
                    <Fragment>
                        <div style={{ marginTop: 20 }}>
                            <StyledBlueButton onClick={() => fileInputRef.current.click()} icon="image">
                                Upload Photo
                            </StyledBlueButton>
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                onChange={handleImageUpload}
                            />
                        </div>
                        <SortableGallery
                            handleDetails={handleImageDetails}
                            handleDelete={handleDeleteImage}
                            items={items}
                            onSortEnd={onSortEnd}
                            axis={"xy"}
                            galleryType="photo"
                        />
                    </Fragment>
                )}
        </div>
    );
}

export default PhotoGallery;