import React, { useState, useEffect } from 'react'
import { AppUrl } from '../../utility/utility';
import axios from 'axios'
import { List, Icon } from "semantic-ui-react";
import { StyledBlueButton, StyledFormTextInput, StyledRedButton, StyledSubmitButton } from '../../StyledComponents';
import Loader from '../../components/Loader/Loader';
import { processCategories } from '../../utility/helper-functions';
import { deleteCategory, getCategories, submitNewCategory } from '../../utility/api';

const Categories = ({ winSize }) => {

    const [categories, setCategories] = useState([]);
    const [categoryEditing, setCategoryEditing] = useState(null);
    const [newCategory, setNewCategory] = useState('');
    const [existingCategory, setExistingCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);




    const fetchCategories = async () => {
        setIsLoading(true);
        const categoriesResponse = await getCategories() || {};
        const processedCategories = processCategories(categoriesResponse.data || []);
        setCategories(processedCategories);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleNewCategory = (e) => {
        setNewCategory(e.target.value)
    }
    const handleExistingCategory = (e) => {
        setExistingCategory(e.target.value)
    }

    const handleEditCategory = (id) => {
        setCategoryEditing(id)
        setExistingCategory(categories.find(c => c._id === id).text)
    }

    const handleDeleteCategory = async (id) => {
        await deleteCategory(id, setIsLoading)
        fetchCategories()
        setIsLoading(false);

    }

    const submit = async () => {
        await submitNewCategory(newCategory, setIsLoading)

        const categoriesResponse = await getCategories();
        const processedCategories = processCategories(categoriesResponse.data);
        setCategories(processedCategories);
        setNewCategory('')

    }

    const updateExistingCategory = async (id) => {
        const formData = new FormData();
        formData.append('name', existingCategory);
        let updateCategoryResponse;
        setIsLoading(true);
        try {
            updateCategoryResponse = await axios.post(`${AppUrl}api/categories/update/${id}`, formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
        } catch (e) {
            console.log('Update category response error', e);
            setIsLoading(false);
        }
        console.log('Update category response', updateCategoryResponse)
        setIsLoading(false);
        setExistingCategory('');
        fetchCategories();
        setCategoryEditing(null)
    }

    const handleCancelEdit = () => {
        setCategoryEditing(null)
    }

    return (
        <div style={{ maxWidth: 800, position: 'relative' }}>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}
            <h1>Categories</h1>
            <span style={{ fontSize: '1.2em' }}>New Category</span>
            <StyledFormTextInput disabled={isLoading} style={{ marginTop: 10 }} value={newCategory}
                onChange={handleNewCategory}
                placeholder='New Category'
            />
            <StyledSubmitButton disabled={isLoading} onClick={submit} style={{ width: 100, margin: '20px 0' }}>Submit</StyledSubmitButton>
            <List>
                {categories.map((c, i) => (
                    <List.Item style={{ padding: 0 }} key={`category[${c._id}]`}>
                        <div style={{ background: i % 2 === 0 ? '#f8fafc' : 'rgb(242,242,242)', padding: 10 }}
                        // onClick={() => handleMessage(m.id)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'left', padding: 10, alignItems: 'center' }}>
                                <div style={{ padding: '10px 0', fontSize: '1.1em', width: 150, marginRight: 10 }}>
                                    {categoryEditing === c._id ?
                                        <StyledFormTextInput disabled={isLoading} value={existingCategory}
                                            onChange={handleExistingCategory}
                                            placeholder='Category' /> : <span>{c.text}</span>}
                                </div>
                                <StyledBlueButton
                                    disabled={isLoading}
                                    style={{ maxHeight: 37 }}
                                    onClick={categoryEditing === c._id ? () => updateExistingCategory(c._id) : () => handleEditCategory(c._id)}>
                                    <Icon style={{ fontSize: '0.9em' }} name={categoryEditing === c._id ? 'checkmark' : 'edit outline'} size='large' />
                                </StyledBlueButton>
                                <StyledRedButton
                                    disabled={isLoading}
                                    style={{ maxHeight: 37 }}
                                    onClick={categoryEditing === c._id ? () => handleCancelEdit() : () => handleDeleteCategory(c._id)}>
                                    <Icon style={{ fontSize: '0.9em' }}
                                        name={categoryEditing === c._id ? 'x' : 'trash alternate outline'} size='large' />
                                </StyledRedButton>
                            </div>
                        </div>
                    </List.Item>))}
            </List>
        </div >
    )
}

export default Categories;

